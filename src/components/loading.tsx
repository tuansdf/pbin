type Props = {
  isLoading?: boolean;
};

export const Loading = ({ isLoading = false }: Props) => {
  if (!isLoading) return null;

  return <article aria-busy={isLoading} />;
};
