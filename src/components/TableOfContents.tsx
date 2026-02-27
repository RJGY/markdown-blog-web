export function TableOfContents({ headings }: { headings: any[] }) {
  if (headings.length === 0) return null;

  // Map levels to Tailwind padding classes
  const indentationMap: Record<number, string> = {
    2: "pl-2",   // ## Level
    3: "pl-6",   // ### Level
    4: "pl-10",   // #### Level
    5: "pl-14",  // ##### Level
    6: "pl-18",  // ###### Level
  };

  return (
    <nav className="toc-nav w-full mb-10 p-4 rounded-lg border">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
        On this page
      </h2>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li 
            key={heading.id} 
            className={`${indentationMap[heading.level] || "pl-0"}`}
          >
            <a 
              href={`#${heading.id}`}
              className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}