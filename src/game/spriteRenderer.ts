import { CharacterGender, InteractiveObject } from '../types/game';

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  time: number;
}

export function drawCourtyardBackground(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  // Courtyard base: Warm vintage pastel sandstone pavement
  ctx.fillStyle = '#F5EBE1';
  ctx.fillRect(0, 0, width, height);

  // Decorative vintage geometric pavement grid
  ctx.strokeStyle = '#E3D3C1';
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Soft terrazzo flecks for eclectic vintage feel
  ctx.fillStyle = 'rgba(226, 149, 120, 0.25)'; // pastel coral flecks
  for (let fx = 50; fx < width - 50; fx += 90) {
    for (let fy = 50; fy < height - 50; fy += 80) {
      ctx.fillRect(fx, fy, 3, 2);
    }
  }

  // Vintage Sage Garden borders on sides
  ctx.fillStyle = '#A3C9A8'; // Soft pastel sage
  ctx.fillRect(30, 30, 60, height - 60);
  ctx.fillRect(width - 90, 30, 60, height - 60);

  // Garden borders retro dark outline
  ctx.strokeStyle = '#2B2D42';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(30, 30, 60, height - 60);
  ctx.strokeRect(width - 90, 30, 60, height - 60);

  // Pastel flowers (Lilac & Butter Yellow)
  const flowerOffsets = [80, 160, 240, 320, 400, 480];
  flowerOffsets.forEach((fy) => {
    ctx.fillStyle = '#C8B6FF'; // Pastel lilac
    ctx.beginPath();
    ctx.arc(60, fy, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFD166'; // Pastel butter yellow
    ctx.beginPath();
    ctx.arc(width - 60, fy, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // Main School Building Facade at Top (Vintage Postmodern block)
  ctx.fillStyle = '#2B2D42'; // Dark slate ink base
  ctx.fillRect(30, 0, width - 60, 45);
  ctx.fillStyle = '#FFD8BE'; // Soft pastel peach strip
  ctx.fillRect(30, 40, width - 60, 8);

  // School Grand Banner: SMK MUHAMMADIYAH BAWANG
  ctx.fillStyle = '#FDF0D5'; // Cream parchment
  ctx.fillRect(240, 8, 420, 28);
  ctx.strokeStyle = '#2B2D42';
  ctx.lineWidth = 2;
  ctx.strokeRect(240, 8, 420, 28);

  ctx.fillStyle = '#2B2D42';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SMK MUHAMMADIYAH BAWANG', 450, 23);
  ctx.fillStyle = '#D97706';
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.fillText('MUHIBA SKILL & INNOVATION EXPO', 450, 32);

  // Center Expo Stage Platform (Postmodern pastel block)
  ctx.fillStyle = '#FEE4D7'; // Pastel peach
  ctx.fillRect(330, 60, 240, 75);
  ctx.strokeStyle = '#2B2D42';
  ctx.lineWidth = 2;
  ctx.strokeRect(330, 60, 240, 75);

  // Eclectic geometric carpet (mint + butter stripes)
  ctx.fillStyle = '#B7E4C7'; // Pastel mint
  ctx.fillRect(340, 70, 220, 55);

  // School Emblem / Logo on Stage (Vintage medal style)
  ctx.fillStyle = '#FFF3B0'; // Butter yellow
  ctx.beginPath();
  ctx.arc(450, 97, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2B2D42';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#2B2D42';
  ctx.font = 'bold 9px sans-serif';
  ctx.fillText('SMB', 450, 100);

  // Department Gateways Signposts with Postmodern pastel tags
  // Left: AKL (Mint)
  ctx.fillStyle = '#B7E4C7';
  ctx.fillRect(90, 45, 84, 24);
  ctx.strokeStyle = '#2B2D42';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(90, 45, 84, 24);
  ctx.fillStyle = '#1B4332';
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('AKL LAB ←', 132, 61);

  // Right: OTOMOTIF (Peach/Coral)
  ctx.fillStyle = '#FFD8BE';
  ctx.fillRect(width - 174, 45, 84, 24);
  ctx.strokeStyle = '#2B2D42';
  ctx.strokeRect(width - 174, 45, 84, 24);
  ctx.fillStyle = '#78290F';
  ctx.fillText('→ OTOMOTIF', width - 132, 61);

  // Center Top: TJKT (Lilac/Sky)
  ctx.fillStyle = '#C8B6FF';
  ctx.fillRect(408, 35, 84, 18);
  ctx.strokeStyle = '#2B2D42';
  ctx.strokeRect(408, 35, 84, 18);
  ctx.fillStyle = '#240046';
  ctx.font = 'bold 9px sans-serif';
  ctx.fillText('↑ TJKT LAB', 450, 48);

  // School Flagpole at (300, 300)
  ctx.fillStyle = '#C4B9A7';
  ctx.fillRect(298, 250, 4, 60);
  ctx.fillStyle = '#FFD166';
  ctx.beginPath();
  ctx.arc(300, 250, 5, 0, Math.PI * 2);
  ctx.fill();

  // Indonesian Flag fluttering animation
  const flutter = Math.sin(time * 0.005) * 3;
  ctx.fillStyle = '#E63946'; // Vintage Crimson Red
  ctx.fillRect(302, 252, 28, 9 + flutter * 0.3);
  ctx.fillStyle = '#FDF0D5'; // Cream white bottom
  ctx.fillRect(302, 261 + flutter * 0.3, 28, 9 - flutter * 0.3);

  // Expo Celebration Bunting / Pennants across courtyard (Eclectic vintage pastels)
  ctx.strokeStyle = '#2B2D42';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(100, 140);
  ctx.quadraticCurveTo(450, 160, 800, 140);
  ctx.stroke();

  const pennantColors = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF'];
  for (let i = 0; i < 14; i++) {
    const px = 120 + i * 48;
    const py = 140 + Math.sin((i / 14) * Math.PI) * 16;
    ctx.fillStyle = pennantColors[i % pennantColors.length];
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + 12, py);
    ctx.lineTo(px + 6, py + 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

export function drawLabBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  type: 'AKL' | 'OTOMOTIF' | 'TJKT',
  time: number
) {
  // Floor base in soft vintage pastel
  if (type === 'AKL') {
    ctx.fillStyle = '#EFF7F6'; // Vintage pastel mint-cream
  } else if (type === 'OTOMOTIF') {
    ctx.fillStyle = '#EFE9E0'; // Vintage workshop biscuit/parchment
  } else {
    ctx.fillStyle = '#E8E8EE'; // Vintage lavender-slate tech floor
  }
  ctx.fillRect(0, 0, width, height);

  // Floor grid
  ctx.strokeStyle = '#DDD5C7';
  ctx.lineWidth = 1;
  const tileSize = 48;
  for (let x = 0; x < width; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Workshop safety zone for Otomotif in vintage pastel apricot
  if (type === 'OTOMOTIF') {
    ctx.fillStyle = '#FDE2B8';
    ctx.fillRect(360, 180, 180, 150);
    ctx.strokeStyle = '#2B2D42';
    ctx.lineWidth = 2;
    ctx.strokeRect(360, 180, 180, 150);
    // diagonal vintage hazard stripes
    ctx.strokeStyle = '#E29578';
    ctx.lineWidth = 4;
    for (let s = 370; s < 530; s += 24) {
      ctx.beginPath();
      ctx.moveTo(s, 180);
      ctx.lineTo(s + 20, 200);
      ctx.stroke();
    }
  }

  // Lab Back Wall in deep slate ink with pastel accent trim
  ctx.fillStyle = '#2B2D42';
  ctx.fillRect(0, 0, width, 45);
  ctx.fillStyle = type === 'AKL' ? '#74C69D' : type === 'OTOMOTIF' ? '#FFD8BE' : '#C8B6FF';
  ctx.fillRect(0, 42, width, 4);

  // Lab Title Sign on Wall
  ctx.fillStyle = '#FDF0D5';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  const labHeader =
    type === 'AKL'
      ? 'AKL • ACCOUNTING & ISLAMIC BANKING LABORATORY'
      : type === 'OTOMOTIF'
      ? 'MUHIBA AUTOMOTIVE ENGINEERING WORKSHOP'
      : 'TJKT • NETWORK & TELECOMMUNICATIONS LABORATORY';
  // TJKT glowing network conduits
  if (type === 'TJKT') {
    const pulse = (Math.sin(time * 0.006) + 1) * 0.5;
    ctx.strokeStyle = `rgba(168, 218, 220, ${0.4 + pulse * 0.4})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 25);
    ctx.lineTo(width - 100, 25);
    ctx.stroke();
  }
}

export function drawChibiCharacter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  gender: CharacterGender,
  direction: 'down' | 'up' | 'left' | 'right',
  isMoving: boolean,
  time: number
) {
  ctx.save();
  ctx.translate(x, y);

  // Walking bounce
  const stepBob = isMoving ? Math.sin(time * 0.015) * 2 : 0;
  const legOffset = isMoving ? Math.sin(time * 0.015) * 3 : 0;

  // Soft shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.ellipse(0, 16, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs / Feet
  ctx.fillStyle = '#0f172a'; // black school shoes
  if (gender === 'boy') {
    // grey vocational high school pants
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-6, 8 + stepBob, 4, 8 + (isMoving ? legOffset : 0));
    ctx.fillRect(2, 8 + stepBob, 4, 8 - (isMoving ? legOffset : 0));
    // shoes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-7, 15 + stepBob, 6, 3);
    ctx.fillRect(1, 15 + stepBob, 6, 3);
  } else {
    // School skirt (grey)
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(-7, 6 + stepBob);
    ctx.lineTo(7, 6 + stepBob);
    ctx.lineTo(9, 14 + stepBob);
    ctx.lineTo(-9, 14 + stepBob);
    ctx.closePath();
    ctx.fill();
    // shoes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-5, 14 + stepBob, 4, 3);
    ctx.fillRect(1, 14 + stepBob, 4, 3);
  }

  // Torso / White School Shirt with SMK Muhammadiyah pocket emblem
  ctx.fillStyle = '#f8fafc'; // White shirt
  ctx.fillRect(-7, -2 + stepBob, 14, 10);

  // Batik accent / Tie / Pocket
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-2, -1 + stepBob, 4, 6);

  // Arms
  ctx.fillStyle = '#f8fafc';
  if (direction === 'left') {
    ctx.fillRect(-8, 0 + stepBob, 3, 7);
  } else if (direction === 'right') {
    ctx.fillRect(5, 0 + stepBob, 3, 7);
  } else {
    ctx.fillRect(-9, 0 + stepBob, 3, 7);
    ctx.fillRect(6, 0 + stepBob, 3, 7);
  }

  // Chibi Head (Cute large circle/rounded rect)
  const headY = -14 + stepBob;
  ctx.fillStyle = '#fde047'; // warm fair skin tone
  ctx.beginPath();
  ctx.arc(0, headY, 11, 0, Math.PI * 2);
  ctx.fill();

  // Hairstyle / Hijab based on gender
  if (gender === 'girl_hijab') {
    // Clean, crisp white/cream Islamic school hijab
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, headY - 1, 12, Math.PI * 0.85, Math.PI * 2.15);
    ctx.fill();
    // Hijab drapery around neck
    ctx.beginPath();
    ctx.moveTo(-11, headY + 2);
    ctx.lineTo(11, headY + 2);
    ctx.lineTo(7, headY + 12);
    ctx.lineTo(-7, headY + 12);
    ctx.closePath();
    ctx.fill();
    // Inner cap edge
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-5, headY - 8, 10, 2);
  } else if (gender === 'girl_nohijab') {
    // Dark anime hair with cute side ponytail
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(0, headY - 2, 12, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();
    // Bangs
    ctx.fillRect(-7, headY - 8, 14, 4);
    // Ponytail ribbon
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(10, headY - 3, 4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Boy stylish neat haircut
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, headY - 3, 12, Math.PI * 0.95, Math.PI * 2.05);
    ctx.fill();
    // Bangs
    ctx.fillRect(-8, headY - 8, 16, 4);
    ctx.fillRect(-3, headY - 4, 6, 2);
  }

  // Cute Chibi Face (only when facing down, left, or right)
  if (direction !== 'up') {
    const eyeOffsetX = direction === 'left' ? -3 : direction === 'right' ? 3 : 0;

    // Big expressive sparkling eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-5 + eyeOffsetX, headY - 2, 3, 4);
    ctx.fillRect(2 + eyeOffsetX, headY - 2, 3, 4);

    // Eye sparkle
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-5 + eyeOffsetX, headY - 2, 1, 2);
    ctx.fillRect(2 + eyeOffsetX, headY - 2, 1, 2);

    // Blushing cheeks
    ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
    ctx.beginPath();
    ctx.arc(-6 + eyeOffsetX, headY + 3, 2, 0, Math.PI * 2);
    ctx.arc(6 + eyeOffsetX, headY + 3, 2, 0, Math.PI * 2);
    ctx.fill();

    // Cute small smile
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0 + eyeOffsetX, headY + 2, 2, 0.1, Math.PI * 0.9);
    ctx.stroke();
  }

  ctx.restore();
}

export function drawNPC(
  ctx: CanvasRenderingContext2D,
  npc: InteractiveObject,
  time: number
) {
  const { x, y } = npc;
  ctx.save();
  ctx.translate(x, y);

  const bob = Math.sin(time * 0.004) * 1.5;

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.ellipse(0, 16, 11, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  if (npc.id.includes('mr_hendra')) {
    // Mr. Hendra: Respected teacher in traditional Indonesian brown batik
    // Legs
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, 8, 4, 8);
    ctx.fillRect(2, 8, 4, 8);
    // Batik shirt
    ctx.fillStyle = '#78350f'; // Warm batik amber
    ctx.fillRect(-8, -2 + bob, 16, 11);
    ctx.fillStyle = '#d97706'; // Batik motif dots
    ctx.fillRect(-5, 0 + bob, 3, 3);
    ctx.fillRect(2, 4 + bob, 3, 3);

    // Head
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0, -14 + bob, 11, 0, Math.PI * 2);
    ctx.fill();

    // Neat hair
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, -17 + bob, 11, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();

    // Spectacles / Glasses
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-6, -16 + bob, 4, 3);
    ctx.strokeRect(2, -16 + bob, 4, 3);
    ctx.beginPath();
    ctx.moveTo(-2, -14 + bob);
    ctx.lineTo(2, -14 + bob);
    ctx.stroke();

    // Warm eyes & smile
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-5, -15 + bob, 2, 2);
    ctx.fillRect(3, -15 + bob, 2, 2);
  } else if (npc.id.includes('naya')) {
    // Naya (AKL): Green Islamic school blazer and neat white hijab
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-6, 8, 12, 8);
    // Green AKL blazer
    ctx.fillStyle = '#059669';
    ctx.fillRect(-8, -2 + bob, 16, 11);

    // White hijab
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -14 + bob, 12, 0, Math.PI * 2);
    ctx.fill();
    // Face opening
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0, -13 + bob, 8, 0, Math.PI * 2);
    ctx.fill();

    // Eyes & smile
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-4, -14 + bob, 2, 3);
    ctx.fillRect(2, -14 + bob, 2, 3);

    // Holding accounting folder
    ctx.fillStyle = '#10b981';
    ctx.fillRect(4, 2 + bob, 6, 8);
  } else if (npc.id.includes('raka')) {
    // Raka (Otomotif): Orange/Navy workshop mechanic jumpsuit
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-7, 6, 5, 10);
    ctx.fillRect(2, 6, 5, 10);
    ctx.fillRect(-8, -2 + bob, 16, 9);

    // Head
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0, -13 + bob, 10, 0, Math.PI * 2);
    ctx.fill();

    // Messy hair
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(0, -16 + bob, 11, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();

    // Safety goggles on forehead
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-6, -19 + bob, 12, 4);

    // Face
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-4, -13 + bob, 2, 3);
    ctx.fillRect(2, -13 + bob, 2, 3);

    // Wrench in hand
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(6, 0 + bob, 3, 9);
  } else if (npc.id.includes('dimas')) {
    // Dimas (TJKT): Tech vest with networking lanyard
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-6, 8, 4, 8);
    ctx.fillRect(2, 8, 4, 8);
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(-8, -2 + bob, 16, 10);

    // Head
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0, -13 + bob, 10, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.arc(0, -16 + bob, 11, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();

    // Face
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-4, -13 + bob, 2, 3);
    ctx.fillRect(2, -13 + bob, 2, 3);

    // Yellow lanyard
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-3, -2 + bob);
    ctx.lineTo(0, 4 + bob);
    ctx.lineTo(3, -2 + bob);
    ctx.stroke();
  }

  // Floating dialogue indicator / speech bubble (Vintage postmodern pastel pill)
  const bubbleY = -34 + Math.sin(time * 0.007) * 4;
  ctx.fillStyle = '#FFF3B0'; // Pastel butter yellow
  ctx.strokeStyle = '#2B2D42';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-16, bubbleY, 32, 16, 6);
  ctx.fill();
  ctx.stroke();

  // Pointer tip
  ctx.beginPath();
  ctx.moveTo(-3, bubbleY + 16);
  ctx.lineTo(0, bubbleY + 20);
  ctx.lineTo(3, bubbleY + 16);
  ctx.fill();
  ctx.stroke();

  // Exclamation or label inside bubble
  ctx.fillStyle = '#2B2D42';
  ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TALK', 0, bubbleY + 11);

  ctx.restore();
}

export function drawInteractiveObject(
  ctx: CanvasRenderingContext2D,
  obj: InteractiveObject,
  isNear: boolean,
  time: number
) {
  const { x, y, width, height } = obj;
  ctx.save();
  ctx.translate(x, y);

  if (obj.type === 'door') {
    // School doorway
    ctx.fillStyle = '#334155';
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.strokeRect(-width / 2, -height / 2, width, height);

    // Door glass panels
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-width / 2 + 5, -height / 2 + 5, width - 10, height - 10);

    // Exit indicator
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DOOR', 0, 4);
  } else if (obj.id === 'electric_motorcycle') {
    // Smart Electric Motorcycle
    // Hydraulic lift stand beneath
    ctx.fillStyle = '#475569';
    ctx.fillRect(-width / 2, 10, width, 12);

    // Wheels
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-22, 12, 11, 0, Math.PI * 2);
    ctx.arc(22, 12, 11, 0, Math.PI * 2);
    ctx.fill();
    // Alloy rim
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-22, 12, 6, 0, Math.PI * 2);
    ctx.arc(22, 12, 6, 0, Math.PI * 2);
    ctx.stroke();

    // Motorcycle Body (futuristic aerodynamic white & turquoise)
    ctx.fillStyle = '#0ea5e9'; // Turquoise blue fairing
    ctx.beginPath();
    ctx.moveTo(-18, 5);
    ctx.lineTo(-6, -14);
    ctx.lineTo(16, -12);
    ctx.lineTo(24, 0);
    ctx.lineTo(10, 6);
    ctx.closePath();
    ctx.fill();

    // Black comfortable seat
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-12, -15, 18, 5);

    // LED Headlight
    const glow = (Math.sin(time * 0.008) + 1) * 0.5;
    ctx.fillStyle = `rgba(56, 189, 248, ${0.7 + glow * 0.3})`;
    ctx.beginPath();
    ctx.arc(22, -6, 4, 0, Math.PI * 2);
    ctx.fill();

    // Handlebar & Digital screen
    ctx.fillStyle = '#64748b';
    ctx.fillRect(10, -20, 2, 8);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(8, -23, 7, 5);
  } else if (obj.id.includes('server')) {
    // High-tech Server Rack
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-width / 2, -height / 2, width, height);

    // Blade server slots
    for (let r = 0; r < 5; r++) {
      const sy = -height / 2 + 5 + r * 9;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-width / 2 + 4, sy, width - 8, 7);

      // Blinking server status LEDs
      const ledColor =
        (Math.floor(time / 400) + r) % 3 === 0
          ? '#10b981'
          : (Math.floor(time / 400) + r) % 3 === 1
          ? '#38bdf8'
          : '#f59e0b';
      ctx.fillStyle = ledColor;
      ctx.fillRect(-width / 2 + 8, sy + 2, 3, 3);
      ctx.fillRect(-width / 2 + 13, sy + 2, 3, 3);
    }
  } else if (obj.id.includes('computer')) {
    // Desk + Computer
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-width / 2, 0, width, 14); // desk
    // Monitor
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-14, -14, 28, 16);
    ctx.fillStyle = '#38bdf8'; // illuminated screen
    ctx.fillRect(-12, -12, 24, 12);
  } else if (obj.id.includes('ledger')) {
    // Accounting Ledger Book
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-14, -8, 28, 16);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-12, -6, 11, 12);
    ctx.fillRect(1, -6, 11, 12);
    ctx.fillStyle = '#059669';
    ctx.fillRect(-10, -3, 7, 2);
    ctx.fillRect(3, -3, 7, 2);
  } else if (obj.id.includes('calculator')) {
    // Financial Calculator
    ctx.fillStyle = '#334155';
    ctx.fillRect(-12, -10, 24, 20);
    ctx.fillStyle = '#a3e635'; // LCD display
    ctx.fillRect(-9, -8, 18, 5);
    // Keys
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-8, 0, 4, 3);
    ctx.fillRect(-2, 0, 4, 3);
    ctx.fillRect(4, 0, 4, 3);
    ctx.fillRect(-8, 5, 4, 3);
    ctx.fillRect(-2, 5, 4, 3);
    ctx.fillRect(4, 5, 4, 3);
  } else if (obj.id.includes('terminal')) {
    // Master Expo / Diagnostic Terminal
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(-width / 2, -height / 2, width, height);
    // Glowing display
    const pulse = (Math.sin(time * 0.005) + 1) * 0.5;
    ctx.fillStyle = `rgba(16, 185, 129, ${0.3 + pulse * 0.3})`;
    ctx.fillRect(-width / 2 + 4, -height / 2 + 4, width - 8, height - 8);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('EXPO ARCHIVE', 0, 3);
  } else {
    // Generic piece of furniture / equipment
    ctx.fillStyle = '#475569';
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(-width / 2, -height / 2, width, height);
  }

  // If player is in proximity, show glowing Vintage Pastel Inspect Bubble
  if (isNear) {
    const bubbleY = -height / 2 - 20 + Math.sin(time * 0.008) * 3;
    ctx.fillStyle = '#FFD8BE'; // Soft pastel peach
    ctx.strokeStyle = '#2B2D42';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-26, bubbleY, 52, 16, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#2B2D42';
    ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EXAMINE', 0, bubbleY + 11);
  } else if (obj.highlight) {
    // Subtle pulsing sparkle indicator
    const pulse = (Math.sin(time * 0.006) + 1) * 0.5;
    ctx.fillStyle = `rgba(255, 209, 102, ${0.4 + pulse * 0.5})`;
    ctx.beginPath();
    ctx.arc(0, -height / 2 - 8, 4 + pulse * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
