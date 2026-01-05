import React, { useRef } from 'react';

const HeroVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * Adjusts the playback rate of the video to ensure the loop duration
   * is exactly 30 seconds, providing a more cinematic and slow-motion effect.
   */
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      if (duration > 0) {
        const targetLoopTime = 30; // Target loop duration in seconds
        // Calculate the rate required to make the video last exactly the target loop time.
        // playbackRate = actual duration / target duration
        videoRef.current.playbackRate = duration / targetLoopTime;
      }
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Cinematic Video Loop - Architectural/Industrial theme */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
        className="absolute top-0 left-0 w-full h-full object-cover grayscale opacity-30 mix-blend-multiply"
        poster="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop"
      >
        <source 
          src="https://player.vimeo.com/external/494252666.sd.mp4?s=721c5496464850ef6236317b96e5793e25d6b492&profile_id=164&oauth2_token_id=57447761" 
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>
      
      {/* Refined Overlays */}
      <div className="absolute inset-0 bg-white/40"></div>
      
      {/* Subtle Gradient for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
      
      {/* Minimalist Grid Overlay for Architectural Feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-[0.03]"></div>
    </div>
  );
};

export default HeroVideo;