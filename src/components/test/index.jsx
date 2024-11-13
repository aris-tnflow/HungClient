import React from "react";
import GjsEditor, {
  AssetsProvider,
  Canvas,
  ModalProvider,
} from "@grapesjs/react";
import pluginFlexbox from "~/components/grapeJs/Custom/Block/FlexBox/";
import { Block } from "~/components/grapeJs/Block";

import { MAIN_BORDER_COLOR } from "./components/common";
import CustomModal from "./components/CustomModal";
import CustomAssetManager from "./components/CustomAssetManager";
import Topbar from "./components/Topbar";
import RightSidebar from "./components/RightSidebar";
import "./style.css";

import "~/components/grapeJs/GrapeJs.css";

const gjsOptions = {
  height: "100vh",
  storageManager: false,
  undoManager: { trackSelection: false },
  selectorManager: { componentFirst: true },
  canvas: {
    styles: ["https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"],
    scripts: ["https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"],
  },
  projectData: {
    assets: [
      "https://via.placeholder.com/350x250/78c5d6/fff",
      "https://via.placeholder.com/350x250/459ba8/fff",
      "https://via.placeholder.com/350x250/79c267/fff",
      "https://via.placeholder.com/350x250/c5d647/fff",
      "https://via.placeholder.com/350x250/f28c33/fff",
    ],
    pages: [
      {
        name: "Home page",
      },
    ],
  },
};

export default function App() {
  const onEditor = (editor) => {
    window.editor = editor;
  };

  return (
    <GjsEditor
      className="gjs-one-bg text-white"
      grapesjs="https://unpkg.com/grapesjs"
      grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
      options={{
        height: "100vh",
        storageManager: false,
        undoManager: { trackSelection: false },
        selectorManager: { componentFirst: true },

        canvas: {
          styles: [
            "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css",
          ],
          scripts: [
            "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js",
          ],
        },
        projectData: {
          assets: [
            "https://via.placeholder.com/350x250/78c5d6/fff",
            "https://via.placeholder.com/350x250/459ba8/fff",
            "https://via.placeholder.com/350x250/79c267/fff",
            "https://via.placeholder.com/350x250/c5d647/fff",
            "https://via.placeholder.com/350x250/f28c33/fff",
          ],
          pages: [
            {
              name: "Home page",
            },
          ],
        },
      }}
      // options={gjsOptions}
      plugins={[
        {
          id: "gjs-blocks-basic",
          src: "https://unpkg.com/grapesjs-blocks-basic",
        },
        {
          id: "grapesjs-component",
          src: "http://127.0.0.1:5500/plugins/dist/index.js",
        },
        pluginFlexbox,
        Block.model3d,
      ]}
      onEditor={onEditor}
    >
      <div className={`flex h-full`}>
        <div className="gjs-column-m flex flex-col flex-grow">
          <Topbar className="h-[54px]" />
          <Canvas className="flex-grow gjs-custom-editor-canvas" />
        </div>
        <RightSidebar
          className={`gjs-column-r w-[250px] border-l ${MAIN_BORDER_COLOR}`}
        />
      </div>

      <ModalProvider>
        {({ open, title, content, close }) => (
          <CustomModal open={open} title={title} close={close}>
            {content}
          </CustomModal>
        )}
      </ModalProvider>

      <AssetsProvider>
        {({ assets, select, close, Container }) => (
          <Container>
            <CustomAssetManager assets={assets} select={select} close={close} />
          </Container>
        )}
      </AssetsProvider>
    </GjsEditor>
  );
}
