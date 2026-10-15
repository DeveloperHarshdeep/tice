import { Header } from "./Header";
import { Footer } from "./Footer";

export function PublicShell({ children }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
