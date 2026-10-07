import { Department, ObjectiveInfo } from '../types/game';

export interface DepartmentConfig {
  id: Department;
  name: string;
  shortName: string;
  indonesianName: string;
  projectTitle: string;
  projectDescription: string;
  npcName: string;
  npcRole: string;
  labName: string;
  color: string;
  accentColor: string;
  keyName: string;
  keyId: string;
}

export const DEPARTMENTS: Record<Department, DepartmentConfig> = {
  AKL: {
    id: 'AKL',
    name: 'Accounting and Islamic Banking',
    shortName: 'AKL',
    indonesianName: 'Akuntansi dan Keuangan Lembaga',
    projectTitle: 'Smart Financial Dashboard',
    projectDescription:
      'A real-time financial tracking application integrating Islamic banking principles with automated journal entries and visual analytics.',
    npcName: 'Naya',
    npcRole: 'Grade X AKL Student Representative',
    labName: 'AKL Accounting Laboratory',
    color: '#059669', // Emerald
    accentColor: '#10b981',
    keyName: 'Accounting Key',
    keyId: 'accounting_key',
  },
  OTOMOTIF: {
    id: 'OTOMOTIF',
    name: 'Automotive Engineering',
    shortName: 'Otomotif',
    indonesianName: 'Teknik Otomotif',
    projectTitle: 'Smart Electric Motorcycle',
    projectDescription:
      'An eco-friendly electric motorbike equipped with a lithium battery pack, brushless DC motor, and digital IoT diagnostics.',
    npcName: 'Raka',
    npcRole: 'Grade X Automotive Student Lead',
    labName: 'Muhiba Automotive Workshop',
    color: '#ea580c', // Orange
    accentColor: '#f97316',
    keyName: 'Automotive Key',
    keyId: 'automotive_key',
  },
  TJKT: {
    id: 'TJKT',
    name: 'Computer and Telecommunication Network',
    shortName: 'TJKT',
    indonesianName: 'Teknik Jaringan Komputer dan Telekomunikasi',
    projectTitle: 'Smart School Network',
    projectDescription:
      'A resilient campus network architecture linking the Expo server, fiber-optic distribution switch, Wi-Fi 6 access points, and server monitors.',
    npcName: 'Dimas',
    npcRole: 'Grade X TJKT Network Administrator',
    labName: 'TJKT Network Laboratory',
    color: '#0284c7', // Sky Blue
    accentColor: '#38bdf8',
    keyName: 'Network Key',
    keyId: 'network_key',
  },
};

export const DESCRIPTIVE_TEXT_GUIDE = {
  title: 'Descriptive Text Mastery Guide',
  definition:
    'A descriptive text is a text which says what a person, place, or thing is like. Its purpose is to describe and reveal a particular subject.',
  genericStructure: [
    {
      part: '1. Identification',
      function: 'Identifies the phenomenon or object to be described.',
      example: 'The Smart Financial Dashboard is an innovative financial software developed by SMK Muhammadiyah Bawang students.',
    },
    {
      part: '2. Description',
      function: 'Describes parts, qualities, physical characteristics, and functions of the subject.',
      example: 'It features modern computers, an organized ledger, and real-time Islamic banking analytics.',
    },
  ],
  languageFeatures: [
    {
      feature: 'Specific Nouns',
      desc: 'Focus on particular objects (e.g., calculator, battery, server rack).',
    },
    {
      feature: 'Descriptive Adjectives',
      desc: 'Words describing qualities (e.g., modern, sleek, efficient, powerful, digital).',
    },
    {
      feature: 'Simple Present Tense',
      desc: 'States general truths and functions (e.g., "The motor generates power", "The dashboard displays transactions").',
    },
    {
      feature: 'Linking Verbs & Possession',
      desc: 'Use of "is / are" (to be) and "has / have" (to have). Example: "The lab is clean", "It has several computers".',
    },
    {
      feature: 'Prepositions of Place',
      desc: 'Describe relative positions (e.g., on, under, above, next to, near, behind).',
    },
  ],
};

export function getDepartmentObjective(
  department: Department,
  step: number
): ObjectiveInfo {
  if (step === 0) {
    return {
      currentObjective: 'Report to Mr. Hendra at the School Courtyard',
      location: 'SMK Muhammadiyah Bawang Courtyard',
      requiredAction: 'Walk up to Mr. Hendra and press [E] or tap to talk.',
      successCondition: 'Learn about the missing Expo project descriptions.',
      nextObjective: `Enter the ${DEPARTMENTS[department].labName}.`,
    };
  }

  if (department === 'AKL') {
    switch (step) {
      case 1:
        return {
          currentObjective: 'Quest 1: Observe the Accounting Laboratory',
          location: 'AKL Accounting Laboratory',
          requiredAction: 'Inspect 5 key accounting objects (computers, ledger, calculator, printer, filing cabinet).',
          successCondition: 'Acquire all 5 vocational accounting vocabulary cards.',
          nextObjective: 'Quest 2: Match objects with suitable descriptive adjectives.',
        };
      case 2:
        return {
          currentObjective: 'Quest 2: Adjective Hunt',
          location: 'AKL Accounting Laboratory',
          requiredAction: 'Match accounting nouns with accurate adjectives (modern, organized, accurate, digital, efficient).',
          successCondition: 'Correctly pair all 5 adjectives.',
          nextObjective: 'Quest 3: Build descriptive sentences using is/are and has/have.',
        };
      case 3:
        return {
          currentObjective: 'Quest 3: Build Descriptive Sentences',
          location: 'AKL Accounting Laboratory',
          requiredAction: 'Assemble grammatically correct sentences about the lab using Simple Present Tense.',
          successCondition: 'Complete all 3 sentence structures with proper subject-verb agreement.',
          nextObjective: 'Quest 4: Construct a complete descriptive paragraph (Identification + Description).',
        };
      case 4:
        return {
          currentObjective: 'Quest 4: Paragraph Construction Challenge',
          location: 'AKL Accounting Laboratory',
          requiredAction: 'Arrange the sentence fragments into Identification followed by Description.',
          successCondition: 'Correct paragraph structure verified by Naya.',
          nextObjective: 'Quest 5: Solve the Smart Financial Dashboard project problem.',
        };
      case 5:
        return {
          currentObjective: 'Quest 5: Solve the Financial Dashboard Problem',
          location: 'AKL Accounting Laboratory - Main Terminal',
          requiredAction: 'Analyze the corrupted system and identify the genuine descriptive text.',
          successCondition: 'Restore the dashboard and uncover DESCRIPTION_LOG_07.',
          nextObjective: 'Return to Courtyard with the Accounting Key.',
        };
      default:
        break;
    }
  } else if (department === 'OTOMOTIF') {
    switch (step) {
      case 1:
        return {
          currentObjective: 'Quest 1: Explore the Electric Motorcycle',
          location: 'Muhiba Automotive Workshop',
          requiredAction: 'Examine 5 motorcycle components (battery, LED headlight, digital dashboard, tires, electric motor).',
          successCondition: 'Identify all 5 vocational automotive components.',
          nextObjective: 'Quest 2: Match components with technical adjectives.',
        };
      case 2:
        return {
          currentObjective: 'Quest 2: Automotive Adjective Challenge',
          location: 'Muhiba Automotive Workshop',
          requiredAction: 'Pair components with proper adjectives (sleek, digital, efficient, powerful, compact).',
          successCondition: 'Complete all adjective pairings accurately.',
          nextObjective: 'Quest 3: Solve the spatial location challenge using prepositions.',
        };
      case 3:
        return {
          currentObjective: 'Quest 3: Spatial Location Challenge',
          location: 'Muhiba Automotive Workshop',
          requiredAction: 'Identify component locations using prepositions (under, above, next to, behind).',
          successCondition: 'Correctly locate all components on the motorcycle schematic.',
          nextObjective: 'Quest 4: Match motorcycle parts to their descriptive functions.',
        };
      case 4:
        return {
          currentObjective: 'Quest 4: Component Function Challenge',
          location: 'Muhiba Automotive Workshop',
          requiredAction: 'Connect parts with their present tense function descriptions.',
          successCondition: 'Verify that each part performs its intended function.',
          nextObjective: 'Quest 5: Repair incorrect descriptive sentences on the diagnostic scanner.',
        };
      case 5:
        return {
          currentObjective: 'Quest 5: Diagnostic Sentence Repair',
          location: 'Muhiba Automotive Workshop - Diagnostic Station',
          requiredAction: 'Identify factual and grammatical errors in corrupted descriptions and fix them.',
          successCondition: 'Start the electric motorcycle and discover the server connection log.',
          nextObjective: 'Return to Courtyard with the Automotive Key.',
        };
      default:
        break;
    }
  } else if (department === 'TJKT') {
    switch (step) {
      case 1:
        return {
          currentObjective: 'Quest 1: Identify Network Equipment',
          location: 'TJKT Network Laboratory',
          requiredAction: 'Inspect 5 network devices (server, router, switch, Ethernet cable, monitor).',
          successCondition: 'Collect the 5 networking hardware vocabulary cards.',
          nextObjective: 'Quest 2: Solve the spatial preposition challenge.',
        };
      case 2:
        return {
          currentObjective: 'Quest 2: Spatial Descriptive Challenge',
          location: 'TJKT Network Laboratory',
          requiredAction: 'Position network equipment according to spatial descriptive clues.',
          successCondition: 'Accurately place devices based on prepositional descriptions.',
          nextObjective: 'Quest 3: Build the logical network topology sequence.',
        };
      case 3:
        return {
          currentObjective: 'Quest 3: Build the Network Topology',
          location: 'TJKT Network Laboratory',
          requiredAction: 'Sequence the network flow: Server → Router → Switch → Computer.',
          successCondition: 'Establish data connection across the network lab.',
          nextObjective: 'Quest 4: Investigate the server backup archive.',
        };
      case 4:
        return {
          currentObjective: 'Quest 4: Investigate Server Backup',
          location: 'TJKT Network Laboratory - Server Rack',
          requiredAction: 'Analyze EXPO_DESCRIPTION_BACKUP.txt and recover the centralized archive.',
          successCondition: 'Discover that descriptions from all 3 departments were unified.',
          nextObjective: 'Quest 5: Restore the network descriptive configuration.',
        };
      case 5:
        return {
          currentObjective: 'Quest 5: Restore Network Configuration',
          location: 'TJKT Network Laboratory - Main Console',
          requiredAction: 'Repair descriptive configuration syntax and decrypt the mysterious movement log.',
          successCondition: 'Bring the Expo portal online and receive the Network Key.',
          nextObjective: 'Return to Courtyard with the Network Key.',
        };
      default:
        break;
    }
  }

  if (step === 6) {
    return {
      currentObjective: 'Assemble the Fragments at the School Courtyard',
      location: 'SMK Muhammadiyah Bawang Courtyard - Expo Stage',
      requiredAction: 'Talk to Mr. Hendra and insert your department key into the central Expo console.',
      successCondition: 'Combine all 3 project fragments into "Smart Muhiba School".',
      nextObjective: 'Complete the Level 6 Independent Descriptive Text Challenge.',
    };
  }

  if (step === 7) {
    return {
      currentObjective: 'Level 6: Independent Descriptive Text Challenge',
      location: 'Expo Presentation Terminal',
      requiredAction: 'Write a complete 4-5 sentence descriptive text for your department project.',
      successCondition: 'Earn a passing score across Identification, Description, and Grammar rubrics.',
      nextObjective: 'Complete the Deep Learning vocational reflection questions.',
    };
  }

  if (step === 8) {
    return {
      currentObjective: 'Deep Learning Reflection',
      location: 'Student Portfolio Reflection',
      requiredAction: 'Answer the 3 vocational English reflection questions.',
      successCondition: 'Complete your vocational English learning portfolio.',
      nextObjective: 'Submit results and receive your Expo Certificate!',
    };
  }

  return {
    currentObjective: 'Mission Complete!',
    location: 'Expo Main Stage',
    requiredAction: 'Review your performance and download or verify your certificate.',
    successCondition: 'Results automatically submitted to Web3Forms.',
    nextObjective: 'Celebrate your achievement at SMK Muhammadiyah Bawang!',
  };
}
