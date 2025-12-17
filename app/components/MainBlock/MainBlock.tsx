interface Description {
    id: number;
    description: string;
}

interface MainBlockProps {
    description: Description;
}

export default function MainBlock({description}: MainBlockProps) {
    return (
        <>
            <div>{description.description}</div>

        </>
    );
}
