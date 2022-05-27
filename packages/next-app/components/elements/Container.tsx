interface ContainerProps {
  children: React.ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
  return (
    <div className="space-y-10 px-4 mx-auto lg:max-w-3xl xl:max-w-4xl">
      <div className="bg-white border-4 rounded-md border-bbGray-100 flex flex-col  p-8 items-center">
        {children}
      </div>
    </div>
  );
};
