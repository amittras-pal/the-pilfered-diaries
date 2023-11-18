import { PropsWithChildren } from "react";

interface AdminLayoutProps extends PropsWithChildren {
  onChange: React.Dispatch<React.SetStateAction<string>>;
  active: string;
}

const modules = [
  { label: "Approve Comments", key: "comments" },
  { label: "Add Story", key: "story" },
  { label: "Add Chapter to Story", key: "chapter" },
  { label: "Add Single Post", key: "post" },
];

const AdminLayout = (props: AdminLayoutProps) => {
  return (
    <div
      className="flex w-full h-full border-t border-gray-700"
      id="adminLayout"
    >
      <div className="basis-1/5 border-r border-gray-700">
        {modules.map((mod) => (
          <button
            key={mod.key}
            onClick={() => props.onChange(mod.key)}
            className={`btn w-full rounded-none justify-start btn-${
              props.active === mod.key ? "warning" : "ghost"
            }`}
          >
            {mod.label}
          </button>
        ))}
      </div>
      <div className="basis-4/5 p-3 overflow-auto">{props.children}</div>
    </div>
  );
};

export default AdminLayout;
