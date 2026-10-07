import React, { useState, useEffect, useRef } from 'react';
import {
  GameProgress,
  GamePhase,
  StudentProfile,
  Department,
  InteractiveObject,
  InventoryItem,
  ScoreState,
} from './types/game';
import {
  saveGameProgress,
  loadGameProgress,
  clearGameProgress,
  defaultProgress,
} from './utils/storage';
import { DEPARTMENTS, getDepartmentObjective } from './data/curriculumData';
import { TitleScreen } from './components/TitleScreen';
import { CharacterSelect } from './components/CharacterSelect';
import { HUD } from './components/HUD';
import { GameEngine } from './game/GameEngine';
import { DialogueBox } from './components/DialogueBox';
import { PrologueTutorialModal } from './components/PrologueTutorialModal';
import { QuestTrackerModal } from './components/QuestTrackerModal';
import { SchoolMapModal } from './components/SchoolMapModal';
import { InventoryModal } from './components/InventoryModal';
import { DepartmentChallenges } from './components/DepartmentChallenges';
import { FinalDescriptionChallenge } from './components/FinalDescriptionChallenge';
import { ReflectionModal } from './components/ReflectionModal';
import { MissionCompleteScreen } from './components/MissionCompleteScreen';
import { sound } from './utils/audio';

export default function App() {
  const [progress, setProgress] = useState<GameProgress>(defaultProgress);
  const [hasSavedGame, setHasSavedGame] = useState(false);

  // Active UI modal states
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showQuestTrackerModal, setShowQuestTrackerModal] = useState(false);
  const [activeChallengeStep, setActiveChallengeStep] = useState<number | null>(null);
  const [isPlayerMoving, setIsPlayerMoving] = useState(false);

  // Active dialogue state
  const [activeDialogue, setActiveDialogue] = useState<{
    speaker: string;
    avatar: 'mr_hendra' | 'naya' | 'raka' | 'dimas' | 'player';
    text: string;
    onNext: () => void;
    nextLabel?: string;
  } | null>(null);

  // Inspected objects tracker for Quest 1
  const inspectedObjectsRef = useRef<Set<string>>(new Set());
  // NPC talk tracker: after being spoken to, NPC automatically will not respond repeatedly during same quest step
  const talkedNpcsRef = useRef<Record<string, number>>({});

  // Load saved game on initial mount
  useEffect(() => {
    const saved = loadGameProgress();
    if (saved && saved.profile) {
      setHasSavedGame(true);
    }
  }, []);

  // Time played counter
  useEffect(() => {
    if (progress.phase === 'TITLE' || progress.phase === 'CHARACTER_SELECT' || progress.phase === 'MISSION_COMPLETE') {
      return;
    }
    const timer = setInterval(() => {
      setProgress((prev) => ({
        ...prev,
        timePlayedSeconds: prev.timePlayedSeconds + 1,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [progress.phase]);

  // Auto-save progress
  useEffect(() => {
    if (progress.profile) {
      saveGameProgress(progress);
    }
  }, [progress]);

  // Start new game handler
  const handleStartNewGame = () => {
    clearGameProgress();
    setProgress({
      ...defaultProgress,
      startTime: Date.now(),
      phase: 'CHARACTER_SELECT',
    });
  };

  // Resume saved game handler
  const handleContinueSavedGame = () => {
    const saved = loadGameProgress();
    if (saved && saved.profile) {
      setProgress(saved);
    }
  };

  // Profile confirmed handler
  const handleProfileSelected = (profile: StudentProfile) => {
    setProgress((prev) => ({
      ...prev,
      profile,
      phase: 'PROLOGUE',
      currentMap: 'courtyard',
      currentQuestStep: 0,
      inventory: [
        {
          id: 'student_id',
          name: `${profile.name}'s Student Badge`,
          category: 'tool',
          description: `Grade X Student ID Card · SMK Muhammadiyah Bawang (${profile.className})`,
          icon: '🪪',
        },
      ],
    }));

    // Trigger opening dialogue with Mr. Hendra
    triggerHendraPrologueDialogue(profile);
  };

  // Dialogue helper for Mr. Hendra Prologue
  const triggerHendraPrologueDialogue = (profile: StudentProfile) => {
    talkedNpcsRef.current['npc_mr_hendra'] = 0;
    setActiveDialogue({
      speaker: 'Mr. Hendra',
      avatar: 'mr_hendra',
      text: `Good morning, ${profile.name}! Welcome to the Muhiba Skill & Innovation Expo 2026. A serious problem happened this morning—the digital project descriptions of our student innovations have disappeared from the digital archive! Do you remember the two core parts of a descriptive text: Identification and Description? Can you help us recover the missing project description for ${profile.department}?`,
      onNext: () => {
        setActiveDialogue({
          speaker: 'Mr. Hendra',
          avatar: 'mr_hendra',
          text: `Your central mission is clear: head into your vocational room, observe the tools, and rebuild the descriptive text from Identification to Description. Are you ready to begin your investigation at SMK Muhammadiyah Bawang?`,
          onNext: () => {
            setActiveDialogue(null);
            setShowTutorialModal(true);
            setProgress((prev) => ({
              ...prev,
              currentQuestStep: 1,
              phase: 'EXPLORATION',
            }));
            // Mark Mr. Hendra as talked for step 1 so he won't trap the player
            talkedNpcsRef.current['npc_mr_hendra'] = 1;
          },
        });
      },
    });
  };

  // Map door transition
  const handleDoorTransition = (
    targetMap: 'courtyard' | 'akl_lab' | 'otomotif_workshop' | 'tjkt_lab'
  ) => {
    sound.playInteract();
    // Safety check: ensure student visits their department
    if (
      progress.profile &&
      targetMap !== 'courtyard'
    ) {
      const targetDept =
        targetMap === 'akl_lab'
          ? 'AKL'
          : targetMap === 'otomotif_workshop'
          ? 'OTOMOTIF'
          : 'TJKT';

      if (targetDept !== progress.profile.department && progress.currentQuestStep < 6) {
        setActiveDialogue({
          speaker: 'School Notice',
          avatar: 'mr_hendra',
          text: `You are assigned to the ${progress.profile.department} mission first. Please enter the ${DEPARTMENTS[progress.profile.department].labName}!`,
          onNext: () => setActiveDialogue(null),
        });
        return;
      }
    }

    setProgress((prev) => ({
      ...prev,
      currentMap: targetMap,
    }));
  };

  // Interactive Object handler
  const handleInteract = (obj: InteractiveObject) => {
    const dept = progress.profile?.department || 'AKL';
    const deptInfo = DEPARTMENTS[dept];

    // Case 1: Talking to Mr. Hendra in Courtyard
    if (obj.id.includes('mr_hendra')) {
      if (progress.currentQuestStep === 0) {
        if (progress.profile) triggerHendraPrologueDialogue(progress.profile);
      } else if (progress.currentQuestStep < 6) {
        // Setelah diajak bicara, NPC secara otomatis tidak akan merespon lagi selama misi yang sama berlangsung
        if (talkedNpcsRef.current[obj.id] === progress.currentQuestStep) {
          return;
        }
        talkedNpcsRef.current[obj.id] = progress.currentQuestStep;

        setActiveDialogue({
          speaker: 'Mr. Hendra',
          avatar: 'mr_hendra',
          text: `Keep investigating in the ${deptInfo.labName}, ${progress.profile?.name}! Talk to ${deptInfo.npcName} and inspect the equipment to recover the missing project description. Can you locate your department room on the school map?`,
          onNext: () => setActiveDialogue(null),
        });
      } else {
        // Step 6: Grand Finale Dialogue with Mr. Hendra
        triggerCourtyardFinaleDialogue();
      }
      return;
    }

    // Case 2: Talking to Department NPC
    if (obj.type === 'npc') {
      // Setelah diajak bicara, NPC secara otomatis tidak akan merespon lagi jika tugas yang sama masih berjalan
      if (talkedNpcsRef.current[obj.id] === progress.currentQuestStep && progress.currentQuestStep === 1 && inspectedObjectsRef.current.size < 5) {
        return;
      }

      const npcSpeaker = deptInfo.npcName;
      const npcAvatar =
        dept === 'AKL' ? 'naya' : dept === 'OTOMOTIF' ? 'raka' : 'dimas';

      if (progress.currentQuestStep === 1) {
        const count = inspectedObjectsRef.current.size;
        if (count < 5) {
          talkedNpcsRef.current[obj.id] = 1;

          // Conversational stimulus questions based on department
          const stimulusText =
            dept === 'AKL'
              ? `Hello ${progress.profile?.name}! Welcome to our Accounting and Islamic Banking lab. Look around our room—we have modern computers and organized digital ledgers to calculate Islamic banking transactions with high accuracy! Can you observe all 5 key tools in this room with me? Which item do you think we use to balance debit and credit ledgers: the computer or the ledger? (Currently inspected: ${count}/5)`
              : dept === 'OTOMOTIF'
              ? `Hey ${progress.profile?.name}! Welcome to the Muhiba Automotive Workshop. Look at our Smart Electric Motorcycle here—it is sleek, silent, and eco-friendly! The battery is placed right under the seat, and the electric motor is mounted on the rear wheel. Can you inspect all 5 key components with me? Where do you think we should look to find the digital speedometer: above the handlebar or under the wheel? (Currently inspected: ${count}/5)`
              : `Hello ${progress.profile?.name}! Welcome to the TJKT Computer and Network Engineering lab. Look at our server rack standing near the wall—it connects our main server to the router and switch with high-speed Ethernet cables! But our network is disconnected today. Can you inspect the 5 network devices with me? Which device connects our local network to the internet: the router or the computer? (Currently inspected: ${count}/5)`;

          setActiveDialogue({
            speaker: npcSpeaker,
            avatar: npcAvatar,
            text: stimulusText,
            onNext: () => setActiveDialogue(null),
          });
        } else {
          // All 5 items inspected: Ready for Quest 2
          const transitionText =
            dept === 'AKL'
              ? `Outstanding work observing the accounting lab! Every tool has a specific vocational purpose. Now, can you match each vocational noun with its best descriptive adjective in Quest 2?`
              : dept === 'OTOMOTIF'
              ? `Superb inspection! You've located all key motorcycle parts. Now, can you pair each technical component with its correct descriptive adjective in Quest 2?`
              : `Brilliant observation! The network hardware is identified. Now, can you describe where each device is located using spatial prepositions in Quest 2?`;

          setActiveDialogue({
            speaker: npcSpeaker,
            avatar: npcAvatar,
            text: transitionText,
            onNext: () => {
              setActiveDialogue(null);
              setProgress((prev) => ({ ...prev, currentQuestStep: 2 }));
              setActiveChallengeStep(2);
            },
          });
        }
      } else if (progress.currentQuestStep >= 2 && progress.currentQuestStep <= 5) {
        // Open the current quest challenge
        setActiveChallengeStep(progress.currentQuestStep);
      } else {
        setActiveDialogue({
          speaker: npcSpeaker,
          avatar: npcAvatar,
          text: `You have uncovered the ${deptInfo.keyName}! Return to the School Courtyard and report to Mr. Hendra at the central terminal. Can you make it back to the courtyard safely?`,
          onNext: () => setActiveDialogue(null),
        });
      }
      return;
    }

    // Case 3: Inspecting Quest 1 Lab Objects
    if (obj.questStep === 1 && progress.currentQuestStep === 1) {
      sound.playDiscovery();
      inspectedObjectsRef.current.add(obj.id);
      const count = inspectedObjectsRef.current.size;

      // Add to inventory if not already present
      const itemExists = progress.inventory.some((i) => i.id === obj.id);
      if (!itemExists) {
        setProgress((prev) => ({
          ...prev,
          scores: {
            ...prev.scores,
            vocabulary: Math.min(20, prev.scores.vocabulary + 4),
          },
          inventory: [
            ...prev.inventory,
            {
              id: obj.id,
              name: obj.name,
              category: 'tool',
              description: obj.description,
              icon: dept === 'AKL' ? '📊' : dept === 'OTOMOTIF' ? '⚙️' : '🖥️',
            },
          ],
        }));
      }

      setActiveDialogue({
        speaker: 'Observation Log',
        avatar: 'player',
        text: `[${obj.name}]: ${obj.description} (Inspected: ${count}/5 vocational objects)`,
        onNext: () => {
          setActiveDialogue(null);
          if (count >= 5) {
            setActiveDialogue({
              speaker: deptInfo.npcName,
              avatar: dept === 'AKL' ? 'naya' : dept === 'OTOMOTIF' ? 'raka' : 'dimas',
              text: `Great work! You have observed all 5 objects in the ${deptInfo.labName}. Now let's tackle Quest 2: Adjective Matching!`,
              onNext: () => {
                setActiveDialogue(null);
                setProgress((prev) => ({ ...prev, currentQuestStep: 2 }));
                setActiveChallengeStep(2);
              },
            });
          }
        },
      });
      return;
    }

    // Case 4: Terminal in Quest 5
    if (obj.questStep === 5 && progress.currentQuestStep === 5) {
      setActiveChallengeStep(5);
      return;
    }

    // Case 5: Expo Central Terminal in Courtyard
    if (obj.id === 'expo_central_terminal') {
      if (progress.currentQuestStep >= 6) {
        triggerCourtyardFinaleDialogue();
      } else {
        setActiveDialogue({
          speaker: 'Expo Archive Terminal',
          avatar: 'player',
          text: `[SYSTEM ALERT]: Project description fragment missing. Please explore your assigned department to recover the key!`,
          onNext: () => setActiveDialogue(null),
        });
      }
      return;
    }

    // General object inspection
    setActiveDialogue({
      speaker: obj.name,
      avatar: 'player',
      text: obj.description,
      onNext: () => setActiveDialogue(null),
    });
  };

  // Grand Finale Dialogue at School Courtyard
  const triggerCourtyardFinaleDialogue = () => {
    const dept = progress.profile?.department || 'AKL';
    const deptInfo = DEPARTMENTS[dept];

    sound.playDiscovery();
    setActiveDialogue({
      speaker: 'Expo Central Terminal',
      avatar: 'player',
      text: `[KEY INSERTED]: ${deptInfo.keyName} successfully authenticated! Connecting project fragments: AKL Smart Financial Dashboard + Otomotif Smart Electric Motorcycle + TJKT Smart School Network...`,
      onNext: () => {
        setActiveDialogue({
          speaker: 'Expo Central Terminal',
          avatar: 'player',
          text: `[SUCCESS]: All three department fragments merged into "SMART MUHIBA SCHOOL"! Expo Archive Restored!`,
          onNext: () => {
            setActiveDialogue({
              speaker: 'Mr. Hendra',
              avatar: 'mr_hendra',
              text: `Congratulations, ${progress.profile?.name}! There was never a malicious hacker. The teachers and students intentionally turned the missing descriptions into an educational challenge!`,
              onNext: () => {
                setActiveDialogue({
                  speaker: 'Mr. Hendra',
                  avatar: 'mr_hendra',
                  text: `“The real challenge was never finding a missing file. It was learning how to describe the world around you using English!” Now, complete your final Level 6 challenge!`,
                  onNext: () => {
                    setActiveDialogue(null);
                    setProgress((prev) => ({
                      ...prev,
                      currentQuestStep: 7,
                      phase: 'FINAL_CHALLENGE',
                    }));
                  },
                });
              },
            });
          },
        });
      },
    });
  };

  // Quest step completion callback from DepartmentChallenges
  const handleCompleteQuestStep = (
    scoreEarned: Partial<ScoreState>,
    rewardItem?: InventoryItem
  ) => {
    setActiveChallengeStep(null);
    sound.playSuccess();

    setProgress((prev) => {
      const nextStep = prev.currentQuestStep + 1;
      const updatedScores = {
        vocabulary: prev.scores.vocabulary + (scoreEarned.vocabulary || 0),
        grammar: prev.scores.grammar + (scoreEarned.grammar || 0),
        structure: prev.scores.structure + (scoreEarned.structure || 0),
        problemSolving: prev.scores.problemSolving + (scoreEarned.problemSolving || 0),
        finalDescription: prev.scores.finalDescription + (scoreEarned.finalDescription || 0),
      };

      const newInv = rewardItem ? [...prev.inventory, rewardItem] : prev.inventory;

      return {
        ...prev,
        currentQuestStep: nextStep,
        scores: updatedScores,
        inventory: newInv,
      };
    });

    // If step 5 was completed (now step 6), show plot twist notification
    if (progress.currentQuestStep === 5) {
      const dept = progress.profile?.department || 'AKL';
      const twistMsg =
        dept === 'AKL'
          ? 'WARNING: Terminal displays DESCRIPTION_LOG_07 with timestamp matching the Automotive Workshop! You received the ACCOUNTING KEY.'
          : dept === 'OTOMOTIF'
          ? 'DIAGNOSTIC NOTICE: Motorcycle connected to Expo Server. Timestamp matches AKL logs! You received the AUTOMOTIVE KEY.'
          : 'SERVER RESTORED: "THE DESCRIPTION WAS NOT DELETED... IT WAS MOVED." You received the NETWORK KEY.';

      setActiveDialogue({
        speaker: 'Expo Investigation Log',
        avatar: 'player',
        text: twistMsg,
        onNext: () => {
          setActiveDialogue({
            speaker: 'Mr. Hendra (P.A. Announcement)',
            avatar: 'mr_hendra',
            text: `Attention ${progress.profile?.name}! Please return to the School Courtyard immediately with your department key!`,
            onNext: () => setActiveDialogue(null),
          });
        },
      });
    }
  };

  // Level 6 Final Description Completion
  const handleCompleteFinalDescription = (text: string, finalScore: number) => {
    sound.playSuccess();
    setProgress((prev) => ({
      ...prev,
      finalText: text,
      scores: {
        ...prev.scores,
        finalDescription: finalScore,
      },
      currentQuestStep: 8,
      phase: 'REFLECTION',
    }));
  };

  // Reflection completion
  const handleCompleteReflection = (reflections: { q1: string; q2: string; q3: string }) => {
    setProgress((prev) => ({
      ...prev,
      reflections,
      phase: 'MISSION_COMPLETE',
    }));
  };

  const currentObj = progress.profile
    ? getDepartmentObjective(progress.profile.department, progress.currentQuestStep)
    : getDepartmentObjective('AKL', 0);

  const currentMapTitle =
    progress.currentMap === 'courtyard'
      ? 'School Courtyard'
      : progress.currentMap === 'akl_lab'
      ? 'AKL Accounting Lab'
      : progress.currentMap === 'otomotif_workshop'
      ? 'Otomotif Workshop'
      : 'TJKT Network Lab';

  return (
    <div className="relative w-full h-full min-h-screen bg-[#F7F4EB] text-[#2B2D42] overflow-hidden font-sans select-none">
      {/* 1. TITLE SCREEN */}
      {progress.phase === 'TITLE' && (
        <TitleScreen
          onStartNew={handleStartNewGame}
          onContinue={hasSavedGame ? handleContinueSavedGame : undefined}
          hasSavedGame={hasSavedGame}
        />
      )}

      {/* 2. CHARACTER & DEPARTMENT SELECTION */}
      {progress.phase === 'CHARACTER_SELECT' && (
        <CharacterSelect onStartGame={handleProfileSelected} />
      )}

      {/* 3. MAIN GAMEPLAY VIEW (EXPLORATION, PROLOGUE, FINAL CHALLEGE, ETC.) */}
      {progress.profile && progress.phase !== 'TITLE' && progress.phase !== 'CHARACTER_SELECT' && (
        <div className="relative w-full h-[100dvh] bg-[#F7F4EB] overflow-hidden">
          {/* Bottom Navigation HUD - Auto-hides on movement & hidden during dialogue */}
          <HUD
            department={progress.profile.department}
            scores={progress.scores}
            objective={currentObj}
            questStep={progress.currentQuestStep}
            totalSteps={8}
            onOpenMap={() => setShowMapModal(true)}
            onOpenInventory={() => setShowInventoryModal(true)}
            onOpenQuestTracker={() => setShowQuestTrackerModal(true)}
            currentMapTitle={currentMapTitle}
            isPlayerMoving={isPlayerMoving || Boolean(activeDialogue)}
          />

          {/* 2D Canvas Game Engine Viewport - Fullscreen adaptive */}
          <div className="w-full h-[100dvh] absolute inset-0">
            <GameEngine
              currentMapId={progress.currentMap}
              gender={progress.profile.gender}
              department={progress.profile.department}
              onInteract={handleInteract}
              onDoorTransition={handleDoorTransition}
              onPlayerMoveChange={setIsPlayerMoving}
              isPaused={
                Boolean(activeDialogue) ||
                showTutorialModal ||
                showMapModal ||
                showInventoryModal ||
                showQuestTrackerModal ||
                activeChallengeStep !== null ||
                progress.phase === 'FINAL_CHALLENGE' ||
                progress.phase === 'REFLECTION' ||
                progress.phase === 'MISSION_COMPLETE'
              }
            />
          </div>

          {/* Active Dialogue Box */}
          {activeDialogue && (
            <DialogueBox
              speaker={activeDialogue.speaker}
              avatar={activeDialogue.avatar}
              text={activeDialogue.text}
              gender={progress.profile.gender}
              department={progress.profile.department}
              onNext={activeDialogue.onNext}
              nextLabel={activeDialogue.nextLabel}
            />
          )}

          {/* Tutorial Briefing Modal */}
          {showTutorialModal && (
            <PrologueTutorialModal onClose={() => setShowTutorialModal(false)} />
          )}

          {/* School Map Modal */}
          {showMapModal && (
            <SchoolMapModal
              currentMap={progress.currentMap}
              department={progress.profile.department}
              onClose={() => setShowMapModal(false)}
            />
          )}

          {/* Inventory & Clues Modal */}
          {showInventoryModal && (
            <InventoryModal
              items={progress.inventory}
              onClose={() => setShowInventoryModal(false)}
            />
          )}

          {/* Quest Tracker Modal */}
          {showQuestTrackerModal && (
            <QuestTrackerModal
              department={progress.profile.department}
              currentQuestStep={progress.currentQuestStep}
              scores={progress.scores}
              onClose={() => setShowQuestTrackerModal(false)}
            />
          )}

          {/* Department Adventure Challenges (Quests 2 to 5) */}
          {activeChallengeStep !== null && (
            <DepartmentChallenges
              department={progress.profile.department}
              questStep={activeChallengeStep}
              onCompleteStep={handleCompleteQuestStep}
              onClose={() => setActiveChallengeStep(null)}
            />
          )}

          {/* Level 6 Final Independent Descriptive Challenge */}
          {progress.phase === 'FINAL_CHALLENGE' && (
            <FinalDescriptionChallenge
              department={progress.profile.department}
              onCompleteFinalText={handleCompleteFinalDescription}
            />
          )}

          {/* Deep Learning Reflection */}
          {progress.phase === 'REFLECTION' && (
            <ReflectionModal
              department={progress.profile.department}
              onCompleteReflection={handleCompleteReflection}
            />
          )}

          {/* Mission Complete & Automatic Result Submission */}
          {progress.phase === 'MISSION_COMPLETE' && (
            <MissionCompleteScreen
              progress={progress}
              onRestart={handleStartNewGame}
            />
          )}
        </div>
      )}
    </div>
  );
}
