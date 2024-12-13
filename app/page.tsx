"use client";
import Image from "next/image";
import { useState } from "react";
import IconPicker from "./components/IconPickerBlock";
import { Download, icons } from "lucide-react";
import ColorPicker from "./components/ColorPicker";
import { logoPresets } from "./presepts";
import React from "react";
import domtoimage from "dom-to-image";
import confetti from "canvas-confetti";

type IconName = keyof typeof icons;

export default function Home() {
  const [selectedIcon, setSelectedIcon] = useState<string>("Heart");

  const SelectedIconComponent =
    selectedIcon && icons[selectedIcon as IconName]
      ? icons[selectedIcon as IconName]
      : null;

  //variable pour selectionner la taille
  const [iconSize, setIconSize] = useState<number>(200);
  const handleIconSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIconSize(Number(e.target.value));
  };

  //variable pour sélectionner la bordure
  const [iconStrokeWidth, setIconStrokeWidth] = useState<number>(3);
  const handleIconStrokeWidthChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIconStrokeWidth(Number(e.target.value));
  };

  //variable pour sélectionner la rotation
  const [iconRotation, setIconRotation] = useState<number>(0);
  const handleIconRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIconRotation(Number(e.target.value));
  };

  const [shadow, setShadow] = useState<string>("shadow-none");
  const [shadowNumber, setShadowNumber] = useState<number>(0);
  const handleShadowNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setShadowNumber(value);
    switch (value) {
      case 25:
        setShadow("shadow-sm");
        break;
      case 50:
        setShadow("shadow-md");
        break;
      case 75:
        setShadow("shadow-lg");
        break;
      case 100:
        setShadow("shadow-2xl");
        break;
      default:
        setShadow("shadow-none");
    }
  };

  const [radius, setRadius] = useState<number>(12);
  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(Number(e.target.value));
  };

  const [activeTab, setActiveTab] = useState<"stroke" | "background" | "fill">(
    "stroke"
  );
  const [iconStrokeColor, setIconStrokeColor] = useState<string>("black");
  const [bgColor, setBgColor] = useState<string>(
    "linear-gradient(45deg, rgba(255, 111, 97, 1) 0%, rgba(255, 185, 120, 1) 100%)"
  );
  const [fillColor, setFillColor] = useState<string>("yellow");

  const getBgStyle = () => {
    return bgColor.startsWith("linear-gradient")
      ? { background: bgColor }
      : { backgroundColor: bgColor };
  };

  const getPresetBgStyle = (color: string) => {
    return color.startsWith("linear-gradient")
      ? { background: color }
      : { backgroundColor: color };
  };

  const handlePresetSelected = (preset: (typeof logoPresets)[0]) => {
    setSelectedIcon(preset.icon);
    setIconSize(preset.iconSize);
    setIconStrokeColor(preset.iconStrokeColor);
    setIconStrokeWidth(preset.iconStrokeWidth);
    setIconRotation(preset.iconRotation);
    setBgColor(preset.bgColor);
    setFillColor(preset.fillColor);
    setRadius(preset.radius * 8);
  };

  const [isDowloading, setIsDowloading] = useState<boolean>(false);
  const [dowloadCompleted, setDowloadCompleted] = useState<boolean>(false);
  const handleDowloadImage = (format: "png" | "svg") => {
    setIsDowloading(true);
    setDowloadCompleted(false);
    const element = document.getElementById("iconContainer");
    if (element) {
      let imagePromise;
      if (format == "svg") {
        imagePromise = domtoimage.toSvg(element, { bgcolor: undefined });
      } else {
        imagePromise = domtoimage.toPng(element, { bgcolor: undefined });
      }

      imagePromise
        .then((dataUrl: string) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `logoCrea.${format}`;
          link.click();

          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.6 },
            zIndex: 999,
          });

          setIsDowloading(false);
          setDowloadCompleted(true);
        })
        .catch((error: any) => {
          console.error(error);
          setIsDowloading(false);
        });
    }
  };

  return (
    <div>
      <section className="flex flex-col md:flex-row md:justify-between">
        {/* traitementt des couleurs/bordures etc */}
        <div className="md:w-1/4 p-5">
          <div className="flex items-center justify-center space-x-2 mb-4 w-full">
            <button
              className={`btn w-1/3 ${
                activeTab === "stroke" ? "btn-accent" : ""
              }`}
              onClick={() => setActiveTab("stroke")}
            >
              Bordure
            </button>
            <button
              className={`btn w-1/3 ${
                activeTab === "background" ? "btn-accent" : ""
              }`}
              onClick={() => setActiveTab("background")}
            >
              Arrière-plan
            </button>
            <button
              className={`btn w-1/3 ${
                activeTab === "fill" ? "btn-accent" : ""
              }`}
              onClick={() => setActiveTab("fill")}
            >
              Remplissage
            </button>
          </div>
          <div>
            {/* selecteur de couleur */}
            {activeTab === "stroke" && (
              <ColorPicker
                color={iconStrokeColor}
                allowGradient={false}
                onColorChange={setIconStrokeColor}
              />
            )}
            {activeTab === "background" && (
              <ColorPicker
                color={bgColor}
                allowGradient={true}
                onColorChange={setBgColor}
              />
            )}
            {activeTab === "fill" && (
              <ColorPicker
                color={fillColor}
                allowGradient={false}
                onColorChange={setFillColor}
              />
            )}
          </div>
          {/* {iconStrokeColor} {bgColor} {fillColor} */}
        </div>

        {/* preview de l'icone crée */}
        <div className="md:w-2/4 flex justify-center items-center h-screen bg-[url('/file.svg')] bg-cover bg-center border border-base-200 pt-4 relative">
          <div className="flex items-center justify-between absolute top-0 left-0 bg-base-100 z-50 w-full p-3">
            <div className="flex items-center font-bold text-2xl">
              <Image
                src="/logo.png"
                width={500}
                height={500}
                className="w-10 h-10 mr-2"
                alt="Logo de LogoCrea"
              />
              Logo<span className="text-accent">Crea</span>
            </div>
            <div className="flex items-center">
              <IconPicker
                selected={selectedIcon}
                onIconSelect={setSelectedIcon}
              />
              <button
                className="btn ml-5 bg-gradient-to-tr from-accent to-warning"
                onClick={() => {
                  const m = document.getElementById(
                    "my_modal_1"
                  ) as HTMLDialogElement;
                  if (m) {
                    m.showModal();
                    setDowloadCompleted(false);
                  }
                }}
              >
                Télécharger <Download className="w-4" />
              </button>
            </div>
          </div>

          <div className="bg-neutral-content/10 hover:bg-neutral-content/20 aspect-square border-2 border-base-300 hover:border-neutral/15 border-dashed p-5 md:p-20">
            <div
              id="iconContainer"
              className={`w-[450px] h-[450px] flex justify-center items-center ${shadow}`}
              style={{ borderRadius: `${radius}px`, ...getBgStyle() }}
            >
              {SelectedIconComponent && (
                <SelectedIconComponent
                  style={{
                    display: "block",
                    strokeWidth: iconStrokeWidth,
                    transform: `rotate(${iconRotation}deg)`,
                    fill: fillColor,
                    stroke: iconStrokeColor,
                  }}
                  size={iconSize}
                />
              )}
            </div>
          </div>
        </div>

        {/* affichage des parametres */}
        <div className="md:w-1/4 p-5">
          <div>
            <div className="flex justify-between mb-3 text-gray-500">
              <label className="badge badge-ghost">Taille</label>
              <span>{iconSize} px</span>
            </div>
            <input
              type="range"
              min="95"
              max="300"
              value={iconSize}
              onChange={handleIconSizeChange}
              className="range range-accent"
            />
          </div>
          <div className="mt-4">
            <div className="flex justify-between mb-3 text-gray-500">
              <label className="badge badge-ghost">Bordure</label>
              <span>{iconStrokeWidth} px</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              value={iconStrokeWidth}
              onChange={handleIconStrokeWidthChange}
              className="range range-accent"
            />
          </div>
          <div className="mt-4">
            <div className="flex justify-between mb-3 text-gray-500">
              <label className="badge badge-ghost">Rotation</label>
              <span>{iconRotation} deg</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={iconRotation}
              onChange={handleIconRotationChange}
              className="range range-accent"
            />
          </div>
          <div className="mt-4">
            <div className="flex justify-between mb-3 text-gray-500">
              <label className="badge badge-ghost">Ombre</label>
              <span>{shadow.replace("shadow-", "")}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step={25}
              value={shadowNumber}
              onChange={handleShadowNumberChange}
              className="range range-accent"
            />
          </div>
          <div className="mt-4">
            <div className="flex justify-between mb-3 text-gray-500">
              <label className="badge badge-ghost">Arrondi</label>
              <span>{radius}</span>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              step={25}
              value={radius}
              onChange={handleRadiusChange}
              className="range range-accent"
            />
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-bold mb-4">Templates</h3>
            <div className="flex flex-wrap gap-2">
              {logoPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="cursor-pointer"
                  onClick={() => handlePresetSelected(preset)}
                >
                  <div
                    className={`w-14 h-14 flex justify-center items-center `}
                    style={{
                      borderRadius: `${preset.radius}px`,
                      ...getPresetBgStyle(preset.bgColor),
                    }}
                  >
                    {icons[preset.icon as keyof typeof icons] &&
                      React.createElement(
                        icons[preset.icon as keyof typeof icons],
                        {
                          style: {
                            display: "block",
                            strokeWidth: preset.iconStrokeWidth,
                            transform: `rotate(${preset.iconRotation}deg)`,
                            fill: preset.fillColor,
                            stroke: preset.iconStrokeColor,
                          },
                          size: 30,
                        }
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          {isDowloading ? (
            <div className="flex justify-center">
              <progress className="progress progress-secondary my-20 w-56"></progress>
            </div>
          ) : dowloadCompleted ? (
            <div className="text-center my-4">
              <p className="text-md font-bold">
                Le téléchargement est terminé avec succès
              </p>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-lg text-center mb-4">
                Choisissez un format de téléchargement
              </h3>
              <div className="space-x-3 flex justify-center">
                <button
                  className="btn"
                  onClick={() => handleDowloadImage("png")}
                >
                  PNG
                </button>
                <button
                  className="btn"
                  onClick={() => handleDowloadImage("svg")}
                >
                  SVG
                </button>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
