import React, { useEffect, useRef } from 'react';

interface StarNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  color: string;
  glow: boolean;
  tier: number; // 0 = far, 1 = mid, 2 = near
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  life: number;
  maxLife: number;
  color: string;
}

interface DynamicTechnoSpaceCanvasProps {
  className?: string;
  interactive?: boolean;
  showGrid?: boolean;
}

export const DynamicTechnoSpaceCanvas: React.FC<DynamicTechnoSpaceCanvasProps> = ({
  className = '',
  interactive = true,
  showGrid = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
    };

    const resize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
    };

    if (interactive) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('mouseleave', onMouseLeave);
    }

    // Initialize cosmic particles across 3 depth tiers
    const count = Math.min(Math.floor((width * height) / 10000), 130);
    const nodes: StarNode[] = [];

    const colors = [
      '#00F0FF', // Cyan
      '#FF5500', // Electric Orange
      '#00E575', // Emerald
      '#8B5CF6', // Cyber Violet
      '#FFFFFF', // Starlight White
      '#F0F4FC', // Ice
    ];

    for (let i = 0; i < count; i++) {
      const tier = i % 7 === 0 ? 2 : i % 3 === 0 ? 1 : 0;
      const speedMult = tier === 2 ? 0.35 : tier === 1 ? 0.2 : 0.08;
      const radius = tier === 2 ? Math.random() * 1.5 + 1.2 : tier === 1 ? Math.random() * 1 + 0.8 : Math.random() * 0.6 + 0.4;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const glow = tier > 0 && Math.random() > 0.4;

      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speedMult,
        vy: (Math.random() - 0.5) * speedMult - (tier * 0.05), // Subtle upward drift
        radius,
        alpha: Math.random() * 0.4 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.3,
        color,
        glow,
        tier,
      });
    }

    // Shooting stars
    const shootingStars: ShootingStar[] = [];
    let nextSpawnTime = 80;

    // Moving Nebula Clouds
    const nebulae = [
      {
        cx: width * 0.25,
        cy: height * 0.2,
        r: Math.max(width, height) * 0.45,
        color1: 'rgba(0, 240, 255, 0.14)',
        color2: 'rgba(14, 116, 144, 0.04)',
        speed: 0.0008,
        phase: 0,
      },
      {
        cx: width * 0.78,
        cy: height * 0.4,
        r: Math.max(width, height) * 0.5,
        color1: 'rgba(255, 85, 0, 0.15)',
        color2: 'rgba(180, 50, 0, 0.03)',
        speed: 0.0006,
        phase: 2.1,
      },
      {
        cx: width * 0.5,
        cy: height * 0.85,
        r: Math.max(width, height) * 0.45,
        color1: 'rgba(139, 92, 246, 0.11)',
        color2: 'rgba(59, 130, 246, 0.02)',
        speed: 0.0005,
        phase: 4.2,
      },
    ];

    let frame = 0;
    let isPaused = false;

    const onVisibilityChange = () => {
      isPaused = document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const render = () => {
      if (!isPaused) {
        frame++;

        // Smooth mouse lerping
        if (mouse.active) {
          mouse.x += (mouse.targetX - mouse.x) * 0.08;
          mouse.y += (mouse.targetY - mouse.y) * 0.08;
        } else {
          mouse.x = -1000;
          mouse.y = -1000;
        }

        // Base clear with deep space canvas tone
        ctx.fillStyle = '#06080F';
        ctx.fillRect(0, 0, width, height);

        // 1. RENDER ORGANIC PLASMA NEBULAE
        ctx.save();
        for (let i = 0; i < nebulae.length; i++) {
          const neb = nebulae[i];
          neb.phase += neb.speed;

          // Parallax offset from mouse
          const pOffsetX = mouse.active ? (mouse.x - width / 2) * 0.03 : 0;
          const pOffsetY = mouse.active ? (mouse.y - height / 2) * 0.03 : 0;

          const cx = neb.cx + Math.sin(neb.phase) * 60 + pOffsetX;
          const cy = neb.cy + Math.cos(neb.phase * 0.8) * 50 + pOffsetY;

          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, neb.r);
          grad.addColorStop(0, neb.color1);
          grad.addColorStop(0.5, neb.color2);
          grad.addColorStop(1, 'transparent');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, neb.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // 2. RENDER PERSPECTIVE TECHNO GRID (Vanishing Cyber Horizon)
        if (showGrid) {
          ctx.save();
          const horizonY = height * 0.45;
          const gridSpeed = (frame * 0.35) % 40;

          // Horizon subtle glow
          const horizonGlow = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 80);
          horizonGlow.addColorStop(0, 'transparent');
          horizonGlow.addColorStop(0.5, 'rgba(0, 240, 255, 0.06)');
          horizonGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = horizonGlow;
          ctx.fillRect(0, horizonY - 40, width, 120);

          // Horizontal perspective lines
          ctx.lineWidth = 1;
          for (let z = 0; z < 14; z++) {
            const rawProgress = (z * 35 + gridSpeed) / 490;
            if (rawProgress > 1) continue;
            // Exponential expansion for 3D depth perspective
            const progress = Math.pow(rawProgress, 2.2);
            const lineY = horizonY + progress * (height - horizonY);

            const alpha = Math.min(progress * 0.22, 0.18);
            ctx.strokeStyle = z % 3 === 0 ? `rgba(255, 85, 0, ${alpha * 1.2})` : `rgba(0, 240, 255, ${alpha})`;

            ctx.beginPath();
            ctx.moveTo(0, lineY);
            ctx.lineTo(width, lineY);
            ctx.stroke();
          }

          // Perspective vertical perspective lines vanishing to center
          const vanishingX = width * 0.5 + (mouse.active ? (mouse.x - width / 2) * 0.05 : 0);
          const cols = 22;
          for (let c = -cols / 2; c <= cols / 2; c++) {
            const bottomX = vanishingX + (c / (cols / 2)) * (width * 0.9);
            ctx.strokeStyle = Math.abs(c) === 1 ? 'rgba(255, 85, 0, 0.12)' : 'rgba(0, 240, 255, 0.08)';
            ctx.beginPath();
            ctx.moveTo(vanishingX, horizonY);
            ctx.lineTo(bottomX, height);
            ctx.stroke();
          }
          ctx.restore();
        }

        // 3. RENDER BACKGROUND TECH RETICLES (Futuristic Tactical HUD Elements)
        ctx.save();
        const reticleTime = frame * 0.003;
        const rx = width * 0.85;
        const ry = height * 0.25;

        // Subtle orbital radar circle
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.07)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(rx, ry, 140, 0, Math.PI * 2);
        ctx.stroke();

        // Dashed counter-rotating ring
        ctx.setLineDash([4, 12]);
        ctx.strokeStyle = 'rgba(255, 85, 0, 0.08)';
        ctx.beginPath();
        ctx.arc(rx, ry, 110, reticleTime, reticleTime + Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Small tech crosshairs
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.beginPath();
        ctx.moveTo(rx - 15, ry);
        ctx.lineTo(rx + 15, ry);
        ctx.moveTo(rx, ry - 15);
        ctx.lineTo(rx, ry + 15);
        ctx.stroke();
        ctx.restore();

        // 4. UPDATE & DRAW SHOOTING STARS
        nextSpawnTime--;
        if (nextSpawnTime <= 0 && shootingStars.length < 3) {
          const startX = Math.random() * width * 1.2;
          const startY = Math.random() * (height * 0.5);
          const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3; // Roughly 45 degrees
          const speed = Math.random() * 8 + 9;

          shootingStars.push({
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            length: Math.random() * 90 + 70,
            life: 0,
            maxLife: Math.random() * 35 + 25,
            color: Math.random() > 0.4 ? '#00F0FF' : '#FF5500',
          });

          nextSpawnTime = Math.floor(Math.random() * 140 + 70);
        }

        ctx.save();
        for (let s = shootingStars.length - 1; s >= 0; s--) {
          const star = shootingStars[s];
          star.x += star.vx;
          star.y += star.vy;
          star.life++;

          const fade = 1 - star.life / star.maxLife;
          if (fade <= 0 || star.x < 0 || star.x > width || star.y > height) {
            shootingStars.splice(s, 1);
            continue;
          }

          const tailX = star.x - star.vx * (star.length / 10);
          const tailY = star.y - star.vy * (star.length / 10);

          const grad = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
          grad.addColorStop(0, star.color);
          grad.addColorStop(0.3, star.color === '#00F0FF' ? 'rgba(0,240,255,0.6)' : 'rgba(255,85,0,0.6)');
          grad.addColorStop(1, 'transparent');

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          // Star head spark
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(star.x, star.y, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // 5. UPDATE NODES & DRAW PROXIMITY LASER CONNECTIONS
        // Update nodes
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          n.x += n.vx;
          n.y += n.vy;

          // Wrap edges with seamless re-entry
          if (n.x < -10) n.x = width + 10;
          if (n.x > width + 10) n.x = -10;
          if (n.y < -10) n.y = height + 10;
          if (n.y > height + 10) n.y = -10;

          // Twinkle alpha
          n.alpha = n.baseAlpha * (0.7 + 0.3 * Math.sin(frame * 0.03 + i));

          // Mouse gravity / subtle repulsion
          if (mouse.active) {
            const dx = n.x - mouse.x;
            const dy = n.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140 && dist > 0) {
              const force = (1 - dist / 140) * 0.8;
              n.x += (dx / dist) * force;
              n.y += (dy / dist) * force;
            }
          }
        }

        // Draw connections between proximate nodes
        ctx.save();
        const maxDist = 95;
        const maxDistSq = maxDist * maxDist;

        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          if (a.tier === 0) continue; // Don't connect deepest background stars

          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            if (b.tier === 0) continue;

            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxDistSq) {
              const dist = Math.sqrt(distSq);
              const connAlpha = (1 - dist / maxDist) * 0.22;

              ctx.strokeStyle =
                a.color === '#FF5500' || b.color === '#FF5500'
                  ? `rgba(255, 85, 0, ${connAlpha})`
                  : `rgba(0, 240, 255, ${connAlpha})`;

              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }

          // Connect nearby nodes to mouse cursor
          if (mouse.active) {
            const mdx = a.x - mouse.x;
            const mdy = a.y - mouse.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

            if (mDist < 160) {
              const mAlpha = (1 - mDist / 160) * 0.45;
              ctx.strokeStyle = `rgba(0, 240, 255, ${mAlpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
            }
          }
        }
        ctx.restore();

        // 6. DRAW NODES (STARS & BEACONS)
        ctx.save();
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];

          // Luminous aura glow on near nodes
          if (n.glow) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = n.color;
          } else {
            ctx.shadowBlur = 0;
          }

          ctx.fillStyle = n.color;
          ctx.globalAlpha = Math.min(Math.max(n.alpha, 0.1), 0.95);
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // 7. CINEMATIC VIGNETTE
        // Softly darkens center & corners so content has maximum contrast and readability
        ctx.save();
        const vignette = ctx.createRadialGradient(
          width * 0.5,
          height * 0.4,
          Math.min(width, height) * 0.25,
          width * 0.5,
          height * 0.5,
          Math.max(width, height) * 0.85
        );
        vignette.addColorStop(0, 'rgba(6, 8, 15, 0.35)');
        vignette.addColorStop(0.7, 'rgba(6, 8, 15, 0.65)');
        vignette.addColorStop(1, 'rgba(6, 8, 15, 0.92)');

        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (interactive) {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseleave', onMouseLeave);
      }
      document.removeEventListener('visibilitychange', onVisibilityChange);
      cancelAnimationFrame(animId);
    };
  }, [interactive, showGrid]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
    />
  );
};
