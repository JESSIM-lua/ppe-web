import React from 'react';
import { useNavigate } from 'react-router';

type ButtonPanierProps = {
    onClick?: (e: React.FormEvent) => void
}

const ButtonPanier: React.FC<ButtonPanierProps> = (props) => {
    const navigate = useNavigate()

    // const listProduct = sessionStorage.getItem('listProducts')
    // const listProductParsed = listProduct? JSON.parse(listProduct): []

    return (
        <button
        type='button'
        onClick={() => {navigate("/panier"); props?.onClick}}
        >Panier</button>
        
    );
};

export default ButtonPanier;