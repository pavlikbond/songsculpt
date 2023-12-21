import React from "react";

type Props = {};
const menus = [
  { title: "Home", path: "/" },
  { title: "Contact", path: "/contact" },
  { title: "Terms of Use", path: "/terms" },
];

const Footer = (props: Props) => {
  return (
    <footer className="my-8 text-slate-50">
      <div className="flex justify-center gap-4 my-8">
        {menus.map((item, idx) => (
          <div key={idx} className=" hover:text-indigo-600">
            <a href={item.path}>{item.title}</a>
          </div>
        ))}
      </div>
      <div className="text-center ">© 2023 SongSculpt</div>
    </footer>
  );
};

export default Footer;
