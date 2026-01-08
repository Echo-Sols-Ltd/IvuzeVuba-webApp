/* eslint-disable */
import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

type ConfigSchema = Record<string, Record<string, string>>
type ConfigVariants<T extends ConfigSchema> = {
  [Variant in keyof T]: keyof T[Variant]
}
type ConfigVariantsMulti<T extends ConfigSchema> = {
  [Variant in keyof T]: keyof T[Variant] | Array<keyof T[Variant]>
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function cva<T extends ConfigSchema>(
  base: string,
  config?: {
    variants?: T
    defaultVariants?: Partial<ConfigVariants<T>>
  }
) {
  const { variants = {} as T, defaultVariants = {} } = config || {}

  return (props?: ConfigVariantsMulti<T> & { className?: string }) => {
    const { className } = props || {};
    const variantKeys = Object.keys(variants)
    const classNames = [base]

    for (const variant of variantKeys) {
      const variantValue = props?.[variant]
      if (!variantValue) continue

      const variantConfig = variants[variant]
      const variantClass = Array.isArray(variantValue)
        ? variantValue.map(v => variantConfig[v as string]).filter(Boolean)
        : variantConfig[variantValue as string]

      if (variantClass) {
        if (Array.isArray(variantClass)) {
          classNames.push(...variantClass)
        } else {
          classNames.push(variantClass)
        }
      }
    }

    if (defaultVariants) {
      for (const variant in defaultVariants) {
        if (props?.[variant] === undefined) {
          const defaultVariant = defaultVariants[variant as keyof typeof defaultVariants]
          if (defaultVariant) {
            classNames.push(variants[variant][defaultVariant as string])
          }
        }
      }
    }

    if (className) {
      classNames.push(className)
    }

    return cn(...classNames)
  }
}

export { cva, cn }
