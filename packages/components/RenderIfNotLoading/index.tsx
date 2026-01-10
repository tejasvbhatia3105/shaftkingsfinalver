const RenderIfNotLoading: React.FC<{
  loading: boolean;
  children: React.ReactNode;
}> = ({ loading, children }) => {
  if (loading) return null;
  return <>{children}</>;
};

export default RenderIfNotLoading;
