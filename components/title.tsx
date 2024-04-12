type TitleProps = {
    children: React.ReactNode;
    type: string;
  };

export const Title = ({ children, type }: TitleProps) => {
  if (type === "h1") {
    return (
      <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white ">
        {children}
      </h1>
    );
  } else {
    return (
      <h2 className="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white ">
        {children}
      </h2>
    );
  }
};
