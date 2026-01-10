const LoadingChat: React.FC = () => {
  return (
    <div id="loading-bubble" className="grey container_chat_loading">
      <div className="spinner gap-x-3">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    </div>
  );
};

export default LoadingChat;
