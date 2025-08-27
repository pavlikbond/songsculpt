import React from "react";

type Props = {};
const menus = [
  { title: "Home", path: "/" },
  { title: "Contact", path: "/contact" },
  { title: "Terms of Use", path: "/terms" },
];

const Footer = (props: Props) => {
  return (
    <footer className="text-[var(--color-accent-dark)] bg-[var(--color-primary)] border-t border-[var(--color-accent)] py-6 mt-auto">
      <div className="flex justify-center gap-4 my-4">
        {menus.map((item, idx) => (
          <div key={idx} className="hover:text-[var(--color-accent)] transition-colors">
            <a href={item.path}>{item.title}</a>
          </div>
        ))}
      </div>
      <div className="text-center">© 2023 SongSculpt</div>
    </footer>
  );
};

export default Footer;
