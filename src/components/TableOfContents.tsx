export function TableOfContents({ headings }: { headings: any[] }) {
  if (headings.length === 0) return null;

  // Map levels to Tailwind padding classes (level 1 = titles, 2-6 indented +1 extra)
  const indentationMap: Record<number, string> = {
    1: "pl-0",   // # Level (section titles - highest)
    2: "pl-4",   // ## Level
    3: "pl-8",   // ### Level
    4: "pl-12",  // #### Level
    5: "pl-16",  // ##### Level
    6: "pl-20",  // ###### Level
  };

  return (
    <nav className="toc-nav w-full mb-10 p-4 rounded-lg border">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
        On this page
      </h2>
      <ul className="space-y-2">
        {headings.flatMap((heading, index) => {
          const elements: React.ReactNode[] = [];
          if (index > 0 && heading.level === 1) {
            elements.push(
              <li key={`hr-${index}`} className="list-none py-2">
                <hr className="border-slate-200 dark:border-slate-700" />
              </li>
            );
          }
          elements.push(
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
          );
          return elements;
        })}
      </ul>
    </nav>
  );
}