"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Check, X } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
  clearable?: boolean;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Seçiniz...",
  searchable = true,
  searchPlaceholder = "Ara...",
  className = "",
  disabled = false,
  clearable = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const filtered = search
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(search.toLowerCase()) ||
          o.description?.toLowerCase().includes(search.toLowerCase()),
      )
    : options;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search on open
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("[data-select-item]");
      items[highlightedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val);
      setIsOpen(false);
      setSearch("");
      setHighlightedIndex(-1);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "Enter":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
            handleSelect(filtered[highlightedIndex].value);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSearch("");
          setHighlightedIndex(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) =>
              prev < filtered.length - 1 ? prev + 1 : 0,
            );
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filtered.length - 1,
          );
          break;
      }
    },
    [disabled, isOpen, highlightedIndex, filtered, handleSelect],
  );

  return (
    <div ref={containerRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            if (isOpen) {
              setSearch("");
              setHighlightedIndex(-1);
            }
          }
        }}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
          isOpen
            ? "bg-white/[0.07] border-[#7B61FF]/50 shadow-[0_0_0_1px_rgba(123,97,255,0.15)]"
            : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
        } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className={selectedOption ? "text-white text-sm" : "text-white/30 text-sm"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {clearable && value && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setSearch("");
              }}
              className="p-0.5 rounded-md hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-white/30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 rounded-xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Search */}
            {searchable && options.length > 5 && (
              <div className="p-2 border-b border-white/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setHighlightedIndex(0);
                    }}
                    placeholder={searchPlaceholder}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/10 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div ref={listRef} className="max-h-60 overflow-y-auto p-1.5 scrollbar-hide">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-white/20">
                  Sonuç bulunamadı
                </div>
              ) : (
                filtered.map((option, index) => {
                  const isSelected = option.value === value;
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      data-select-item
                      onClick={() => handleSelect(option.value)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-100 ${
                        isSelected
                          ? "bg-[#7B61FF]/10 text-white"
                          : isHighlighted
                            ? "bg-white/[0.06] text-white"
                            : "text-white/70 hover:text-white"
                      }`}
                    >
                      {/* Icon */}
                      {option.icon && (
                        <span className="flex-shrink-0">{option.icon}</span>
                      )}

                      {/* Label + Description */}
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium block truncate">
                          {option.label}
                        </span>
                        {option.description && (
                          <span className="text-xs text-white/30 block truncate mt-0.5">
                            {option.description}
                          </span>
                        )}
                      </div>

                      {/* Selected Check */}
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#7B61FF] flex-shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
