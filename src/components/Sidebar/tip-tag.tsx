export function TipTag({ title }: { title: string }) {
  return (
    <span className="absolute dark:bg-[#fff2] bg-[#0001] top-0 right-0 px-1 py-0 text-[0.6rem] font-bold dark:text-yellow-400 rounded-xl -mt-3 -mr-8">
      {title}
    </span>
  );
}
