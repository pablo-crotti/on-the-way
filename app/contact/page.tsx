"use client";
export default function ContactPage() {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const responseData = await response.text();
            alert(responseData);
        } catch (error: any) {
            alert(error.message);
        }
    }
    return (
        <div className="w-full flex flex-col items-center justify-center">
            <h1 className="text-white font-bold">Contactez-nous</h1>
            <form className="flex flex-col w-3/5 gap-2" onSubmit={handleSubmit}>
                <label htmlFor="email" className="text-white">Email</label>
                <input type="text" placeholder="john.doe@mail.com" name="email" required />
                <label htmlFor="category" className="text-white">Sujet</label>
                <select name="category" required>
                    <option value="">--Choix du sujet--</option>
                    <option value="COMMENT">Commentaire</option>
                    <option value="QUESTION">Question</option>
                    <option value="PARTNERSHIP">Partenariat (entreprise)</option>
                    <option value="LOCATION">Proposition de lieu (auditeur)</option>
                    <option value="OTHER">Autre (champ libre)</option>
                </select>
                <label htmlFor="object" className="text-white">Objet</label>
                <input type="text" placeholder="Episode X..." name="object" required />
                <label htmlFor="message" className="text-white">Message</label>
                <input type="text" placeholder="Concernant l'épisode X..." name="message" required className="mb-8" />
                <button type="submit" className="bg-white">Envoyer</button>
            </form>
        </div>
    )
}