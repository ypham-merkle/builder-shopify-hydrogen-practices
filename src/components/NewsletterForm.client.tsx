import {useState} from 'react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email}),
            });
            if (response.status === 200) {
                return {};
            } else {
                return res.json();
            }
        } catch (error: any) {
            return {
                error: error.toString(),
            };
        }
    };

  return (
    <>
      <form method="POST" action="/" onSubmit={handleSubmit}>
        <label>
          Email:{' '}
          <input style={{ color: "#000" }}
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button>Subscribe</button>
      </form>
    </>
  );
}