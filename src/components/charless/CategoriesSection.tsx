import React from 'react';
import { Code, Server, Layers } from 'lucide-react';
import styles from "@/styles/charless/categories.module.css";

const Categories = () => {
  const categories = [
    { icon: <Code className={styles.icon} />, name: "Front End Development" },
    { icon: <Server className={styles.icon} />, name: "Back End Development" },
    { icon: <Layers className={styles.icon} />, name: "Framework & Library" }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>
            Kategori Kursus yang Kami Sediakan
          </h2>
          
          <div className={styles.grid}>
            {categories.map((category, index) => (
              <div 
                key={index}
                className={styles.categoryCard}
              >
                <div className={styles.iconWrapper}>
                  {category.icon}
                </div>
                <h3 className={styles.categoryName}>{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;