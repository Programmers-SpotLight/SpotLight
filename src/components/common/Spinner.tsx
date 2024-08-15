interface IProps {
  size: "extraSmall" | "small" | "large";
  full?: boolean;
}

export default function Spinner({ size, full = false }: IProps) {
  let spinnerSize: string;
  if (size === "extraSmall") {
    spinnerSize = "1rem";
  } else if (size === "small") {
    spinnerSize = "3rem";
  } else {
    spinnerSize = "6rem";
  }

  const spinner = (
    <div
      className="mx-auto border border-solid border-4 border-b-grey3 border-l-grey3 border-t-primary border-r-primary rounded-full animate-spin "
      style={{ height: spinnerSize, width: spinnerSize }}
    ></div>
  );

  return (
    <>
      {full ? (
        <div className="flex items-center justify-center min-h-screen">
          {spinner}
        </div>
      ) : (
        spinner
      )}
    </>
  );
}
