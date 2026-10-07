import { GameProgress, RankTitle } from '../types/game';

export function calculateTotalScore(scores: GameProgress['scores']): number {
  return (
    scores.vocabulary +
    scores.grammar +
    scores.structure +
    scores.problemSolving +
    scores.finalDescription
  );
}

export function getRankTitle(totalScore: number): RankTitle {
  if (totalScore >= 90) return 'DESCRIPTION MASTER';
  if (totalScore >= 80) return 'EXCELLENT EXPLORER';
  if (totalScore >= 70) return 'SKILLED EXPLORER';
  if (totalScore >= 60) return 'DEVELOPING EXPLORER';
  return 'KEEP EXPLORING';
}

export function formatTimePlayed(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

/**
 * Ensures the HTML form and required hidden fields exist in the document,
 * populates all fields, and submits to Web3Forms automatically.
 */
export async function submitGameResult(
  progress: GameProgress
): Promise<{ success: boolean; message: string }> {
  if (!progress.profile) {
    return { success: false, message: 'Student profile missing' };
  }

  const totalScore = calculateTotalScore(progress.scores);
  const rank = getRankTitle(totalScore);
  const timeFormatted = formatTimePlayed(progress.timePlayedSeconds);

  // Department readable name
  const majorName =
    progress.profile.department === 'AKL'
      ? 'AKL (Accounting and Islamic Banking)'
      : progress.profile.department === 'OTOMOTIF'
      ? 'Otomotif (Automotive)'
      : 'TJKT (Computer and Telecommunication Network)';

  // Find or create the HTML form element
  let form = document.getElementById('form') as HTMLFormElement | null;
  if (!form) {
    form = document.createElement('form');
    form.id = 'form';
    form.style.display = 'none';
    document.body.appendChild(form);
  }

  // Ensure submit button exists inside form
  let submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  if (!submitBtn) {
    submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Submit';
    form.appendChild(submitBtn);
  }

  const fieldsData: Record<string, string> = {
    student_name: progress.profile.name || 'Anonymous Student',
    class: progress.profile.className || 'X SMK',
    major: majorName,
    game_score: totalScore.toString(),
    vocabulary_score: progress.scores.vocabulary.toString(),
    grammar_score: progress.scores.grammar.toString(),
    problem_solving_score: progress.scores.problemSolving.toString(),
    descriptive_text_score: (progress.scores.structure + progress.scores.finalDescription).toString(),
    completion_status: 'COMPLETED',
    time_played: timeFormatted,
    final_rank: rank,
    final_descriptive_text: progress.finalText || 'N/A',
    reflection_1: progress.reflections.q1 || 'N/A',
    reflection_2: progress.reflections.q2 || 'N/A',
    reflection_3: progress.reflections.q3 || 'N/A',
    subject: `Muhiba Mystery Results - ${progress.profile.name} (${progress.profile.className})`,
  };

  // Populate or create hidden inputs dynamically
  Object.entries(fieldsData).forEach(([fieldName, val]) => {
    let input = form!.querySelector(`input[name="${fieldName}"]`) as HTMLInputElement | null;
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = fieldName;
      input.id = `game_${fieldName}`;
      form!.appendChild(input);
    }
    input.value = val;
  });

  const formData = new FormData(form);
  formData.append('access_key', '81166d47-3e04-4e03-b59a-4bd2e1cd81c1');

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true, message: 'Success! Your message has been sent.' };
    } else {
      return {
        success: false,
        message: data.message || 'Server error occurred during submission.',
      };
    }
  } catch (error) {
    console.error('Web3Forms submission error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    };
  }
}
