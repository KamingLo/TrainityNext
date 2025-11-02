const teamMembers = [
    { name: 'Charless', img: '/Author/charless.svg' },
    { name: 'Fabio Fransisco', img: '/Author/fabio.svg' },
    { name: 'Joe Nickson Lie', img: '/Author/joe.svg' },
    { name: 'Michael Andre', img: '/Author/michael.svg' },
    { name: 'Kaming Lo', img: '/Author/kaming.svg' },
  ];
  
  export default function FAQAuthor() {
    return (
      <section className="team-section">
        <h4>Anggota Pengembang Trainity</h4>
        <div className="team-container">
          {teamMembers.map((member) => (
            <div key={member.name} className="team-member">
              <img src={member.img} alt={member.name} />
              <p>{member.name}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }