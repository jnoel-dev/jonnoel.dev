export default function TitleBar({ title }) {
  return (
    <h1 className="flex items-center justify-center w-full text-xl">
      <span className="flex-1 border-t border-current  "></span> {/* 🔹 Adds margin below the line */}
      <span className="px-2 text-[24px]">{title}</span> {/* 🔹 Adds padding around the text */}
      <span className="flex-1 border-t border-current "></span>
    </h1>
  );
}
