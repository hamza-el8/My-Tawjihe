import Sidebar from './Sidebar';

export default function Layout({ children, onRetakeOnet }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar onRetakeOnet={onRetakeOnet} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
