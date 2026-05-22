import type { MouseEventHandler, PropsWithChildren } from "react";
import s from './style.module.scss'

interface ButtonProps extends PropsWithChildren {
  active?: boolean
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
}

const Button = ({ children, active, disabled, onClick, className }:ButtonProps) => {
  const btnClasses = [
    s.btn,
    active ? s.active : '',
    disabled ? s.disabled : '',
    className
  ].filter(Boolean).join(' ');

  return(
    <button 
      disabled={disabled}
      onClick={onClick}
      className={btnClasses}
    >
      {children}
    </button>
  )
}

export default Button;