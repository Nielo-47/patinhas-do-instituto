export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary rounded-full p-0 shadow-vibrant">
        <img
          src="/favicon.ico"
          alt="Patinhas do Instituto"
          className="w-20 h-20 object-cover rounded-full"
        />
      </div>
      <div className="hidden sm:block">
        <h1 className="text-xl font-bold text-secondary leading-tight">
          Patinhas
        </h1>
        <p className="text-sm text-secondary/80 leading-tight">do Instituto</p>
      </div>
    </div>
  );
};
