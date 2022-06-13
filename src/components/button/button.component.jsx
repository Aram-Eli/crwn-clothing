
/*
default

inverted

google sign in 
*/

import './button.styles.scss';

const BUTTON_TYPE_CLASSES = {
    google: 'google-sign-in',
    inverted: 'inverted',
}


const Button = ({children, buttontype, ...otherProps}) => {
    return (
       <button 
          className={`button-container ${BUTTON_TYPE_CLASSES[buttontype]}`} 
          {...otherProps}
       >
          {children}
       </button>
    );
};

export default Button;