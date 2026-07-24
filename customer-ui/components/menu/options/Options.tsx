"use client";

import { useState, useEffect } from "react";
import { Option } from "@/types";
import styles from "./options.module.css";

interface OptionsProps {
  options_en: Option[];
  options_el: Option[];
  currentLocale: string;
  onOptionsChange: (
    selectedOptions: Array<{
      group: string;
      options: Array<{ option: string; index: number; en: string; el: string }>;
    }>
  ) => void;
}

const Options: React.FC<OptionsProps> = ({
  options_en,
  options_el,
  currentLocale,
  onOptionsChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<
    Array<{
      group: string;
      options: Array<{ option: string; index: number; en: string; el: string }>;
    }>
  >([]);

  useEffect(() => {
    const initialSelection: Array<{
      group: string;
      options: Array<{ option: string; index: number; en: string; el: string }>;
    }> = [];
    options_en.forEach((optionGroup, index) => {
      initialSelection.push({
        group: optionGroup.title,
        options: [],
      });
    });

    setSelectedOptions(initialSelection);
    onOptionsChange(initialSelection);
  }, [options_en, options_el]);

  const handleOptionChange = (
    groupIndex: number,
    optionIndex: number,
    isChecked: boolean
  ) => {
    const updatedSelection = selectedOptions.map((group, index) => {
      if (index === groupIndex) {
        const selectedGroup = {
          group: group.group,
          options: isChecked
            ? [
                ...group.options,
                {
                  option: options_en[groupIndex].options[optionIndex],
                  index: optionIndex,
                  en: options_en[groupIndex].options[optionIndex],
                  el: options_el[groupIndex]?.options[optionIndex] || "",
                },
              ]
            : group.options.filter((opt) => opt.index !== optionIndex),
        };
        return selectedGroup;
      }
      return group;
    });

    setSelectedOptions(updatedSelection);
    onOptionsChange(updatedSelection);
  };

  return (
    <div className={styles.optionsContainer}>
      {options_en.map((optionGroup, groupIndex) => (
        <div className={styles.optionGroup} key={groupIndex}>
          <h3>
            {currentLocale === "el"
              ? options_el[groupIndex]?.title
              : optionGroup.title}
          </h3>
          {optionGroup.options.map((option, optionIndex) => (
            <label key={optionIndex}>
              <input
                type="checkbox"
                checked={selectedOptions[groupIndex]?.options.some(
                  (opt) => opt.index === optionIndex
                )}
                onChange={(e) =>
                  handleOptionChange(groupIndex, optionIndex, e.target.checked)
                }
              />
              {currentLocale === "el"
                ? options_el[groupIndex]?.options[optionIndex]
                : option}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Options;
