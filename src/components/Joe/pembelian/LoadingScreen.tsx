interface LoadingScreenProps {
  isVisible: boolean;
}

export default function LoadingScreen({ isVisible }: LoadingScreenProps) {
  if (!isVisible) return null;

  return (
    <div id="loading-screen" className={isVisible ? "" : "fade-out"}>
      <div className="anim"></div>
      <p>Loading</p>
    </div>
  );
}
