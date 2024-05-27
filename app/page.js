import Image from "next/image";
import styles from "./page.module.css";
import CarouselClient from "./component/CarouselClient";
export default function Home() {
  return (
    <main className="container-fluid pt-5">
      <CarouselClient />
    </main>
  );
}
