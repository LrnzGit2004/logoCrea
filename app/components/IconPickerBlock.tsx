//ce composant est la popUp qui va permettre d'afficher les icones
import React, { useState } from "react";
import { icons } from "lucide-react";

type iconPickerProps = {
  selected: string; //représente le nom de l'icone sélectionée
  onIconSelect: (icon: string) => void;
};
type IconName = keyof typeof icons;
const IconPickerBlock: React.FC<iconPickerProps> = ({
  selected,
  onIconSelect,
}) => {
  const [selectedIcon, setSelectedIcon] = useState<string>(selected);
  const [searchText, setSearchText] = useState<string>("");

  const SelectedIconComponent =
    selectedIcon && icons[selectedIcon as IconName]
      ? icons[selectedIcon as IconName]
      : null; //si le nom de l'icon et l'icone existe on recupere l'icon et on le met dans la constant sion on retourne null

  const iconNames: IconName[] = Object.keys(icons) as IconName[]; //liste de toutes nos icones

  const filteredIconNames = iconNames.filter((iconName) => {
    return iconName.toLowerCase().includes(searchText.toLowerCase());
  }); //fonction pour filtrer nos icones

  const handleIconClick = (iconName: IconName) => {
    setSelectedIcon(iconName);
    onIconSelect(iconName);
    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  return (
    <div>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn"
        onClick={() =>
          (
            document.getElementById("my_modal_3") as HTMLDialogElement
          ).showModal()
        }
      >
        {SelectedIconComponent ? <SelectedIconComponent size={20} /> : null}
      </button>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <input
            type="text"
            className="input input-bordered w-full my-4"
            placeholder="Recherchez une icone"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="grid grid-cols-6 gap-2">
            {filteredIconNames.map((iconName) => {
              const IconComponent = icons[iconName];
              return (
                <button
                  key={iconName}
                  className={`btn ${
                    selectedIcon === iconName ? "btn-accent" : ""
                  }`}
                  onClick={() => handleIconClick(iconName)}
                >
                  <IconComponent size={30} />
                </button>
              );
            })}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default IconPickerBlock;