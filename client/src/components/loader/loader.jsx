const Loader = () => {
  return (
    <>
      <section className="flex justify-center items-center h-screen fixed top-0 left-0 right-0 bottom-0">
        <img
          src={"/assets/logo.png"}
          alt="loader"
          width={500}
          height={500}
          className="animate-pulse"
        />
      </section>
    </>
  );
};

export default Loader;
