export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary rounded-full p-3 shadow-vibrant">
        <img
          src="/favicon.ico"
          alt="Patinhas do Instituto"
          className="w-16 h-16 object-contain"
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
