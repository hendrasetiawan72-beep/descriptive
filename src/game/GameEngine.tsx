import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CharacterGender, Department, InteractiveObject } from '../types/game';
import { MAPS, GameMapDefinition } from './mapData';
import {
  drawCourtyardBackground,
  drawLabBackground,
  drawChibiCharacter,
  drawNPC,
  drawInteractiveObject,
} from './spriteRenderer';
import { sound } from '../utils/audio';

interface GameEngineProps {
  currentMapId: 'courtyard' | 'akl_lab' | 'otomotif_workshop' | 'tjkt_lab';
  gender: CharacterGender;
  department: Department;
  onInteract: (obj: InteractiveObject) => void;
  onDoorTransition: (targetMap: 'courtyard' | 'akl_lab' | 'otomotif_workshop' | 'tjkt_lab') => void;
  isPaused: boolean;
  spawnPosition?: { x: number; y: number; direction: 'down' | 'up' | 'left' | 'right' };
  onPlayerMoveChange?: (isMoving: boolean) => void;
}

interface TouchParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  startTime: number;
  color: string;
  size: number;
}

interface TouchRipple {
  x: number;
  y: number;
  startTime: number;
  color: string;
}

export const GameEngine: React.FC<GameEngineProps> = ({
  currentMapId,
  gender,
  department,
  onInteract,
  onDoorTransition,
  isPaused,
  spawnPosition,
  onPlayerMoveChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const map: GameMapDefinition = MAPS[currentMapId];
  const wasMovingRef = useRef(false);

  // Responsive player state
  const playerRef = useRef({
    x: spawnPosition?.x ?? map.spawnPoint.x,
    y: spawnPosition?.y ?? map.spawnPoint.y,
    vx: 0,
    vy: 0,
    baseSpeed: 4.2,
    direction: spawnPosition?.direction ?? map.spawnPoint.direction,
    isMoving: false,
    radius: 13,
  });

  // Tap-to-move and target object auto-interaction
  const targetPointRef = useRef<{ x: number; y: number } | null>(null);
  const targetObjectRef = useRef<InteractiveObject | null>(null);

  // Active touch / flick tracking for "Sentuh Jentik"
  const touchStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    startTime: number;
    isContinuousDrag: boolean;
  } | null>(null);

  // Keyboard controls for desktop fallback
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // Visual touch ripples & dust particles for tactile retro feedback
  const ripplesRef = useRef<TouchRipple[]>([]);
  const particlesRef = useRef<TouchParticle[]>([]);

  // Nearby object reference
  const nearbyObjectRef = useRef<InteractiveObject | null>(null);
  const [nearbyPrompt, setNearbyPrompt] = useState<string | null>(null);

  // Current camera zoom state ref
  const viewTransformRef = useRef({
    scale: 1,
    camX: 0,
    camY: 0,
    viewWidth: 720,
    viewHeight: 480,
  });

  // Reset player when map changes
  useEffect(() => {
    playerRef.current.x = spawnPosition?.x ?? map.spawnPoint.x;
    playerRef.current.y = spawnPosition?.y ?? map.spawnPoint.y;
    playerRef.current.direction = spawnPosition?.direction ?? map.spawnPoint.direction;
    playerRef.current.vx = 0;
    playerRef.current.vy = 0;
    playerRef.current.isMoving = false;
    targetPointRef.current = null;
    targetObjectRef.current = null;
  }, [currentMapId, map, spawnPosition]);

  const handleTriggerInteraction = useCallback(
    (obj: InteractiveObject) => {
      if (obj.type === 'door') {
        sound.playInteract();
        if (obj.id === 'door_akl') {
          onDoorTransition('akl_lab');
        } else if (obj.id === 'door_otomotif') {
          onDoorTransition('otomotif_workshop');
        } else if (obj.id === 'door_tjkt') {
          onDoorTransition('tjkt_lab');
        } else if (obj.id.startsWith('exit_door')) {
          onDoorTransition('courtyard');
        }
      } else {
        onInteract(obj);
      }
    },
    [onDoorTransition, onInteract]
  );

  // Keyboard controls for desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;
      const code = e.code;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(code)) {
        if (['ArrowUp', 'ArrowDown'].includes(code)) e.preventDefault();
        keysPressed.current[code] = true;
        targetPointRef.current = null;
        targetObjectRef.current = null;
      }

      if ((code === 'KeyE' || code === 'Space') && nearbyObjectRef.current) {
        e.preventDefault();
        sound.playInteract();
        handleTriggerInteraction(nearbyObjectRef.current);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPaused, handleTriggerInteraction]);

  // Screen coordinate to Game World coordinate
  const screenToWorld = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;

      const { scale, camX, camY } = viewTransformRef.current;
      return {
        x: camX + clickX / scale,
        y: camY + clickY / scale,
      };
    },
    []
  );

  // Spawn retro dust particles on flick
  const spawnFlickParticles = (x: number, y: number, dirX: number, dirY: number) => {
    const colors = ['#FFD8BE', '#B7E4C7', '#C8B6FF', '#FFE6A7'];
    const now = performance.now();
    for (let i = 0; i < 6; i++) {
      const angle = Math.atan2(dirY, dirX) + (Math.random() - 0.5) * 1.5;
      const speed = 1.2 + Math.random() * 2.5;
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        startTime: now,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 3,
      });
    }
  };

  // SENTUH JENTIK & TAP-TO-MOVE CONTROLS (Mobile-first, No virtual joystick or buttons)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPaused) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }

    touchStateRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      startTime: performance.now(),
      isContinuousDrag: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPaused || !touchStateRef.current || touchStateRef.current.pointerId !== e.pointerId) return;
    const t = touchStateRef.current;
    const dx = e.clientX - t.startX;
    const dy = e.clientY - t.startY;
    const dist = Math.hypot(dx, dy);

    // Continuous glide if finger held and dragged
    if (dist > 12) {
      t.isContinuousDrag = true;
      const len = Math.max(1, dist);
      const dragSpeed = playerRef.current.baseSpeed * Math.min(1.3, dist / 40);
      playerRef.current.vx = (dx / len) * dragSpeed;
      playerRef.current.vy = (dy / len) * dragSpeed;
      targetPointRef.current = null;
      targetObjectRef.current = null;
    }

    t.lastX = e.clientX;
    t.lastY = e.clientY;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPaused || !touchStateRef.current || touchStateRef.current.pointerId !== e.pointerId) return;
    const t = touchStateRef.current;
    const duration = performance.now() - t.startTime;
    const dx = e.clientX - t.startX;
    const dy = e.clientY - t.startY;
    const dist = Math.hypot(dx, dy);

    touchStateRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }

    // --- CASE 1: SENTUH JENTIK (FLICK GESTURE) ---
    // Fast, decisive flick swipe (quick flick with high velocity)
    if (dist > 14 && duration < 380) {
      const flickSpeed = Math.min(7.2, Math.max(4.5, (dist / duration) * 9.5));
      playerRef.current.vx = (dx / dist) * flickSpeed;
      playerRef.current.vy = (dy / dist) * flickSpeed;
      targetPointRef.current = null;
      targetObjectRef.current = null;

      sound.playFlickSwoosh(1.2);

      // Add pastel flick ripple and retro dust particles
      const worldPos = screenToWorld(e.clientX, e.clientY);
      if (worldPos) {
        ripplesRef.current.push({
          x: worldPos.x,
          y: worldPos.y,
          startTime: performance.now(),
          color: '#FFD8BE', // Pastel Peach
        });
        spawnFlickParticles(worldPos.x, worldPos.y, dx, dy);
      }
      return;
    }

    // If continuous dragging was released, let player glide naturally to a stop
    if (t.isContinuousDrag) {
      return;
    }

    // --- CASE 2: DIRECT TAP / CLICK ---
    if (dist <= 14) {
      const worldPos = screenToWorld(e.clientX, e.clientY);
      if (worldPos) {
        // Pastel tap ripple
        ripplesRef.current.push({
          x: worldPos.x,
          y: worldPos.y,
          startTime: performance.now(),
          color: '#B7E4C7', // Pastel Mint
        });

        // Check if user tapped directly on an interactive object or NPC
        let tappedObj: InteractiveObject | null = null;
        for (const obj of map.objects) {
          const d = Math.hypot(worldPos.x - obj.x, worldPos.y - obj.y);
          if (d < 46) {
            tappedObj = obj;
            break;
          }
        }

        if (tappedObj) {
          sound.playInteract();
          // If within reach, trigger interaction immediately
          const distToPlayer = Math.hypot(playerRef.current.x - tappedObj.x, playerRef.current.y - tappedObj.y);
          if (distToPlayer < 58) {
            handleTriggerInteraction(tappedObj);
            return;
          }
          // Otherwise, walk toward it and auto-interact on arrival
          targetPointRef.current = { x: tappedObj.x, y: tappedObj.y };
          targetObjectRef.current = tappedObj;
        } else {
          // Standard tap to walk
          targetPointRef.current = worldPos;
          targetObjectRef.current = null;
        }
      }
    }
  };

  // Main 60 FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();
    let stepSoundTimer = 0;

    const gameLoop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const p = playerRef.current;

      if (!isPaused) {
        let inputX = 0;
        let inputY = 0;

        // 1. Desktop Keyboard Input
        if (keysPressed.current['ArrowUp'] || keysPressed.current['KeyW']) inputY -= 1;
        if (keysPressed.current['ArrowDown'] || keysPressed.current['KeyS']) inputY += 1;
        if (keysPressed.current['ArrowLeft'] || keysPressed.current['KeyA']) inputX -= 1;
        if (keysPressed.current['ArrowRight'] || keysPressed.current['KeyD']) inputX += 1;

        if (inputX !== 0 || inputY !== 0) {
          const len = Math.hypot(inputX, inputY);
          p.vx = (inputX / len) * p.baseSpeed;
          p.vy = (inputY / len) * p.baseSpeed;
        } else if (targetPointRef.current) {
          // 2. Tap-to-move pathing
          const tdx = targetPointRef.current.x - p.x;
          const tdy = targetPointRef.current.y - p.y;
          const tdist = Math.hypot(tdx, tdy);

          if (tdist > 8) {
            p.vx = (tdx / tdist) * p.baseSpeed;
            p.vy = (tdy / tdist) * p.baseSpeed;
          } else {
            p.vx = 0;
            p.vy = 0;
            targetPointRef.current = null;

            if (targetObjectRef.current) {
              const obj = targetObjectRef.current;
              targetObjectRef.current = null;
              handleTriggerInteraction(obj);
            }
          }
        } else if (!touchStateRef.current?.isContinuousDrag) {
          // 3. Sentuh jentik momentum decay (smooth retro glide)
          p.vx *= 0.92;
          p.vy *= 0.92;
          if (Math.abs(p.vx) < 0.1) p.vx = 0;
          if (Math.abs(p.vy) < 0.1) p.vy = 0;
        }

        // Determine movement state and facing direction
        const currentSpeed = Math.hypot(p.vx, p.vy);
        const moving = currentSpeed > 0.28;

        if (moving !== wasMovingRef.current) {
          wasMovingRef.current = moving;
          if (onPlayerMoveChange) onPlayerMoveChange(moving);
        }

        if (moving) {
          p.isMoving = true;
          if (Math.abs(p.vx) > Math.abs(p.vy)) {
            p.direction = p.vx > 0 ? 'right' : 'left';
          } else {
            p.direction = p.vy > 0 ? 'down' : 'up';
          }

          stepSoundTimer += dt;
          if (stepSoundTimer > 0.3) {
            stepSoundTimer = 0;
            sound.playStep();
          }
        } else {
          p.isMoving = false;
          stepSoundTimer = 0;
        }

        // Collision detection with sliding response
        const newX = p.x + p.vx;
        const newY = p.y + p.vy;
        let canMoveX = true;
        let canMoveY = true;

        if (newX - p.radius < 24 || newX + p.radius > map.bounds.width - 24) canMoveX = false;
        if (newY - p.radius < 24 || newY + p.radius > map.bounds.height - 24) canMoveY = false;

        for (const wall of map.walls) {
          if (
            newX + p.radius > wall.x &&
            newX - p.radius < wall.x + wall.width &&
            p.y + p.radius > wall.y &&
            p.y - p.radius < wall.y + wall.height
          ) {
            canMoveX = false;
          }
          if (
            p.x + p.radius > wall.x &&
            p.x - p.radius < wall.x + wall.width &&
            newY + p.radius > wall.y &&
            newY - p.radius < wall.y + wall.height
          ) {
            canMoveY = false;
          }
        }

        if (canMoveX) p.x = newX;
        else p.vx = 0;

        if (canMoveY) p.y = newY;
        else p.vy = 0;

        // Proximity detection to objects & NPCs
        let closest: InteractiveObject | null = null;
        let minDist = 58;
        for (const obj of map.objects) {
          const d = Math.hypot(p.x - obj.x, p.y - obj.y);
          if (d < minDist) {
            minDist = d;
            closest = obj;
          }
        }
        nearbyObjectRef.current = closest;
        setNearbyPrompt(closest ? closest.name : null);
      }

      // --- RENDERING PASS ---
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const cssWidth = rect.width;
      const cssHeight = rect.height;

      // Ensure canvas pixel dimensions match device display
      if (canvas.width !== Math.round(cssWidth * dpr) || canvas.height !== Math.round(cssHeight * dpr)) {
        canvas.width = Math.round(cssWidth * dpr);
        canvas.height = Math.round(cssHeight * dpr);
      }

      // Fullscreen Adaptive Scaling:
      // Fill the entire smartphone/tablet screen with zero empty borders!
      const minDimension = Math.min(cssWidth, cssHeight);
      const isPortrait = cssHeight > cssWidth;
      const baseUnits = isPortrait ? 380 : 440;
      const scale = Math.max(0.85, Math.min(2.2, minDimension / baseUnits));

      const viewWidth = cssWidth / scale;
      const viewHeight = cssHeight / scale;

      // Smooth camera centered on player, clamped or centered if map is smaller than view
      let camX: number;
      if (viewWidth >= map.bounds.width) {
        camX = -(viewWidth - map.bounds.width) / 2;
      } else {
        camX = Math.max(0, Math.min(map.bounds.width - viewWidth, p.x - viewWidth / 2));
      }

      let camY: number;
      if (viewHeight >= map.bounds.height) {
        camY = -(viewHeight - map.bounds.height) / 2;
      } else {
        camY = Math.max(0, Math.min(map.bounds.height - viewHeight, p.y - viewHeight / 2));
      }

      viewTransformRef.current = {
        scale,
        camX,
        camY,
        viewWidth,
        viewHeight,
      };

      // Reset and clear canvas
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw vintage postmodern pastel background paper for surrounding edges
      ctx.fillStyle = '#F7F4EB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Begin world transform
      ctx.save();
      ctx.scale(dpr * scale, dpr * scale);
      ctx.translate(-camX, -camY);

      // 1. Draw Map Background
      if (currentMapId === 'courtyard') {
        drawCourtyardBackground(ctx, map.bounds.width, map.bounds.height, currentTime);
      } else {
        const labType =
          currentMapId === 'akl_lab' ? 'AKL' : currentMapId === 'otomotif_workshop' ? 'OTOMOTIF' : 'TJKT';
        drawLabBackground(ctx, map.bounds.width, map.bounds.height, labType, currentTime);
      }

      // 2. Draw Touch Ripples (Sentuh Jentik / Tap Visuals)
      ripplesRef.current = ripplesRef.current.filter((r) => {
        const age = (currentTime - r.startTime) / 400;
        if (age >= 1) return false;
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2.5 * (1 - age);
        ctx.beginPath();
        ctx.arc(r.x, r.y, 8 + age * 26, 0, Math.PI * 2);
        ctx.stroke();
        return true;
      });

      // 3. Draw Touch Particles (Dust Puffs)
      particlesRef.current = particlesRef.current.filter((pt) => {
        const age = (currentTime - pt.startTime) / 380;
        if (age >= 1) return false;
        pt.x += pt.vx;
        pt.y += pt.vy;
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = 1 - age;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * (1 - age * 0.5), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        return true;
      });

      // 4. Draw Destination Target Indicator if walking
      if (targetPointRef.current) {
        ctx.strokeStyle = '#2A9D8F';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(targetPointRef.current.x, targetPointRef.current.y, 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 5. Draw Interactive Objects and NPCs
      for (const obj of map.objects) {
        const isNear = nearbyObjectRef.current?.id === obj.id;
        if (obj.type === 'npc') {
          drawNPC(ctx, obj, currentTime);
        } else {
          drawInteractiveObject(ctx, obj, isNear, currentTime);
        }
      }

      // 6. Draw Player Chibi Character
      drawChibiCharacter(
        ctx,
        p.x,
        p.y,
        gender,
        p.direction,
        p.isMoving,
        currentTime
      );

      // 7. Contextual Interaction Bubble over Player when near object/NPC
      if (nearbyObjectRef.current) {
        const obj = nearbyObjectRef.current;
        const bubbleY = p.y - 36;
        ctx.save();
        ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
        const label = obj.type === 'npc' ? `💬 Bicara: ${obj.name}` : `🔍 Periksa: ${obj.name}`;
        const metrics = ctx.measureText(label);
        const bubbleW = metrics.width + 14;

        ctx.fillStyle = '#FFFDF9';
        ctx.strokeStyle = '#2B2D42';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(p.x - bubbleW / 2, bubbleY - 14, bubbleW, 16, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#2B2D42';
        ctx.fillText(label, p.x - bubbleW / 2 + 7, bubbleY - 3);
        ctx.restore();
      }

      ctx.restore();

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [currentMapId, map, gender, isPaused, handleTriggerInteraction]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden bg-[#F7F4EB] flex items-center justify-center touch-none"
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full block pixelated touch-none cursor-pointer"
      />

      {/* Subtle Immersive Touch Guidance Hint: Vintage Postmodern Eclectic Pill */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 pointer-events-none z-10 opacity-75 hover:opacity-100 transition-opacity">
        <div className="px-3.5 py-1 bg-[#FFFDF9]/90 backdrop-blur-xs border-2 border-[#2B2D42] rounded-full text-[10px] text-[#2B2D42] font-black shadow-[2px_2px_0_0_#2B2D42] flex items-center gap-1.5 tracking-tight">
          <span className="text-[#E76F51]">✨</span>
          <span>Sentuh jentik untuk meluncur · Ketuk untuk interaksi</span>
        </div>
      </div>
    </div>
  );
};
