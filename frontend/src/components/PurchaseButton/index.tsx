import clsx from 'clsx';
import { useState } from "react";

interface Props {
	onPurchase: (quantity: number) => void
}

const PurchaseControlledButton: React.FC<Props> = ({ onPurchase }) => {
	const [quantity, setQuantity] = useState<number>(1);

	const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) > 999999999) setQuantity(999999999)
		else setQuantity(Number(e.target.value));
	};

	const decrease = () => {
		if (quantity <= 0) setQuantity(0);
		else setQuantity(prev => prev - 1);
	};

	const increase = () => {
		if (quantity >= 999999999) setQuantity(999999999);
		else setQuantity(prev => prev + 1);
	};

	return (
		<div className="purchase-button-controller">
			<div className="quatity-control">
				<button onClick={decrease}>-</button>
				<input type="number" min={0} value={quantity} onChange={handleChangeInput} />
				<button onClick={increase}>+</button>
			</div>
			<button 
				className={clsx("button button--secondary box__purchase", { "button--disabled": quantity <= 0 })} 
				onClick={() => onPurchase(quantity)}
				disabled={quantity <= 0}
			>
				Purchase
			</button>
		</div>
	);
};

export default PurchaseControlledButton;
