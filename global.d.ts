import { Container } from "./components/e-components/core"

interface Window {
  _econtainer: Container;
}

declare global {
  interface Window {
    _econtainer: Container;
  }
}
