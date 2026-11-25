import React from 'react';

export const BackgroundBlobs: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Mesh grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Blob 1: Top Left - Indigo / Blue */}
      <div 
        className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] rounded-full opacity-25 filter blur-[120px] animate-blob"
        style={{
          background: 'radial-gradient(circle, #6366F1 0%, rgba(99, 102, 241, 0) 70%)',
          animationDuration: '14s'
        }}
      />

      {/* Blob 2: Top Right - Purple / Pink */}
      <div 
        className="absolute top-[10%] -right-[15%] w-[450px] h-[450px] sm:w-[600px] sm:h-[600px] rounded-full opacity-20 filter blur-[130px] animate-blob"
        style={{
          background: 'radial-gradient(circle, #8B5CF6 0%, #EC4899 40%, rgba(139, 92, 246, 0) 70%)',
          animationDuration: '18s',
          animationDelay: '3s'
        }}
      />

      {/* Blob 3: Center / Middle - Cyan */}
      <div 
        className="absolute top-[45%] left-[20%] w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] rounded-full opacity-15 filter blur-[140px] animate-blob"
        style={{
          background: 'radial-gradient(circle, #06B6D4 0%, rgba(6, 182, 212, 0) 70%)',
          animationDuration: '20s',
          animationDelay: '6s'
        }}
      />

      {/* Blob 4: Bottom Right - Indigo / Violet */}
      <div 
        className="absolute -bottom-[10%] right-[5%] w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full opacity-20 filter blur-[140px] animate-blob"
        style={{
          background: 'radial-gradient(circle, #4F46E5 0%, #7C3AED 50%, rgba(79, 70, 229, 0) 75%)',
          animationDuration: '16s',
          animationDelay: '8s'
        }}
      />
    </div>
  );
};
