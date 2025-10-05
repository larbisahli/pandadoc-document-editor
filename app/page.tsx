import EditorShell from "@/components/editor/EditorShell";
import Header from "@/components/header";
import SidebarComponent from "@/components/sidebar";

export default function Home() {
  return (
    <div className="flex h-full w-full flex-col">
      <Header />
      <main className="relative h-full w-full flex-1">
        <div className="editor-container bottom absolute top-0 right-0 left-0 h-full">
          <div className="editor-wrapper h-full">
            <div className="root-container flex h-full w-full">
              <section className="content-container relative w-full overflow-hidden">
                <EditorShell />
              </section>
              <aside className="sidebar-container relative h-full">
                <SidebarComponent />
              </aside>
            </div>
          </div>
        </div>
      </main>
      <div id="portal-root" />
      <div id="portal-dialog" />
    </div>
  );
}
