const genderIdentities = [
    {
        id: "1",
        name: "Agender",
        info: `<p><strong>Agender</strong> is a gender identity that can be understood as the absence of gender or a neutral gender identity. Agender individuals may not identify with any traditional gender roles or concepts, feeling either a lack of gender altogether or a neutral gender identity that is neither male nor female.</p>
             <p>Reference: <a href="https://lgbtqia.fandom.com/wiki/Agender" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline; cursor: pointer;">LGBTQIA Wiki - Agender</a></p>`
      },
      {
        id: "2",
        name: "Bigender",
        info: `<p><strong>Bigender</strong> individuals experience two gender identities, either simultaneously or varying between the two. These identities can be any combination of male, female, or any non-binary identities. Bigender people might experience their dual identities in various ways and may use different gender expressions to reflect their gender identity at different times.</p>
                <p>Reference: <a href="https://lgbtqia.fandom.com/wiki/Bigender" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline; cursor: pointer;">LGBTQIA Wiki - Bigender</a></p>`
      },
      {
        id: "3",
        name: "Demigender",
        info: `<p><strong>Demigender</strong> individuals partially identify with one gender but not wholly. This partial identification can be with any gender within the gender spectrum, making it a flexible identity that allows for a personal connection to gender that isn't fully encompassed by binary definitions.</p>
                 <p>Reference: <a href="https://lgbtqia.fandom.com/wiki/Demigender" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline; cursor: pointer;">LGBTQIA Wiki - Demigender</a></p>`
      },
      {
        id: "4",
        name: "Female",
        info: `<p>The term <strong>Female</strong> traditionally refers to a gender identity aligned with womanhood or femininity. Individuals identifying as female might align with traditional feminine roles or characteristics, but the expression and identification with these roles can vary widely among individuals.</p>`
      },
      {
        id: "5",
        name: "Gender Fluid",
        info: `<p><strong>Gender Fluid</strong> refers to a gender identity that varies over time. A gender fluid person's gender identity and expression can change, sometimes fluctuating between more masculine, more feminine, or any other non-binary identities.</p>
                 <p>Reference: <a href="https://lgbtqia.fandom.com/wiki/Genderfluid" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline; cursor: pointer;">LGBTQIA Wiki - Gender Fluid</a></p>`    
      },
      {
        id: "6",
        name: "Gender Neutral",
        info: `<p><strong>Gender Neutral</strong> is a term used to describe a gender identity that does not align with traditional binary gender categories of male or female. It can also refer to an approach or policy that does not discriminate based on gender.</p>
                <p>Reference: <a href="https://lgbtqia.fandom.com/wiki/Genderneutral" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline; cursor: pointer;">LGBTQIA Wiki - Gender Neutral</a></p>`
      },
      {
        id: "7",
        name: "Gender Non-Conforming",
        info: `<p><strong>Gender Non-Conforming</strong> is a term for individuals whose gender expression does not adhere to conventional gender roles. This identity highlights the diversity of gender expressions and experiences beyond the binary framework of male and female.</p>
                <p>Reference: <a href="https://lgbtqia.fandom.com/wiki/Gendernonconforming" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline; cursor: pointer;">LGBTQIA Wiki - Gender Non-Conforming</a></p>`
      },
      {
        id: "8",
        name: "Genderqueer",
        info: `<p><strong>Genderqueer</strong> is a gender identity that challenges conventional understandings of gender. It can be used by individuals who do not subscribe to traditional gender distinctions but may identify with neither, both, or a combination of male and female genders.</p>
                <p>Reference: <a href="https://lgbtqia.fandom.com/wiki/Genderqueer" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline; cursor: pointer;">LGBTQIA Wiki - Gender Queer</a></p>`
      },
      {
        id: "9",
        name: "Intersex",
        info: `<p><strong>Intersex</strong> is a term used to describe a variety of conditions where a person is born with reproductive or sexual anatomy that doesn't fit typical definitions of male or female. Intersex traits can involve chromosomes, genitalia, or secondary sex characteristics.</p>
                <p>Reference: <a href="https://lgbtqia.fandom.com/wiki/Intersex" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline; cursor: pointer;">LGBTQIA Wiki - Intersexual</a></p>`
      },
      {
        id: "10",
        name: "Male",
        info: `<p><strong>Male</strong> refers to a gender identity traditionally associated with being a man or masculinity. Individuals identifying as male may express their gender in a variety of ways, not confined to societal norms of masculinity.</p>`
      },
      {
        id: "11",
        name: "Neurogender",
        info: `<p><strong>Neurogender</strong> is a term that encompasses gender identities influenced by an individual's neurotype. For people whose experience of their gender is deeply intertwined with their neurological makeup, particularly those who are neurodivergent.</p>
                <p>Reference: <a href="https://lgbtqia.fandom.com/wiki/Neurogender" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline; cursor: pointer;">LGBTQIA Wiki - Neurogender</a></p>`
      },
      {
        id: "12",
        name: "Non-Binary",
        info: `<p><strong>Non-Binary</strong> describes a gender identity that does not fit strictly within the male or female categories. Non-binary individuals may identify as having a gender that blends elements of both male and female, fluctuates between them, or may not relate to any traditional gender at all.</p>
                <p>Reference: <a href="https://lgbtqia.fandom.com/wiki/Non-Binary" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline; cursor: pointer;">LGBTQIA Wiki - Non-Binary</a></p>`
      },
      {
        id: "13",
        name: "Polygender",
        info: `<p><strong>Polygender</strong> individuals identify with multiple genders simultaneously or vary between them over time. This identity recognizes the complexity and fluidity of gender, allowing for a broad spectrum of gender experiences.</p>
                <p>Reference: <a href="https://lgbtqia.fandom.com/wiki/Polygender" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline; cursor: pointer;">LGBTQIA Wiki - Polygender</a></p>`
      },
      {
        id: "14",
        name: "Questioning",
        info: `<p><strong>Questioning</strong> is a process where individuals explore and investigate their own gender identity, sexual orientation, or both. This exploration is a healthy part of understanding oneself and one's place in the spectrum of gender and sexuality.</p>
                <p>Reference: <a href="https://lgbtqia.fandom.com/wiki/Questioning" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline; cursor: pointer;">LGBTQIA Wiki - Questioning</a></p>`
      },      
      {
        id: "15",
        name: "Transgender",
        info: `<p><strong>Transgender</strong> is an umbrella term for people whose gender identity differs from the sex they were assigned at birth. Transgender people may identify as male, female, or a different gender entirely.</p>
                <p>Reference: <a href="https://lgbtqia.fandom.com/wiki/Transgender" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline; cursor: pointer;">LGBTQIA Wiki - Transgender</a></p>`
      },
      {
        id: "16",
        name: "Two-Spirit",
        info: `<p><strong>Two-Spirit</strong> is a term used by some Indigenous North American communities to describe a person who embodies both masculine and feminine spirits. It's a cultural identity that covers a variety of gender and sexual orientations within Indigenous cultures.</p>
                <p>Reference: <a href="https://lgbtqia.fandom.com/wiki/Two-Spirit" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline; cursor: pointer;">LGBTQIA Wiki - Two-Spirit</a></p>`
      },
      {
        id: "17",
        name: "Xenogender",
        info: `<p><strong>Xenogender</strong> refers to non-traditional gender identities that cannot be fully understood in terms of conventional binary or non-binary gender categories. Xenogender individuals might relate their gender experience to concepts, things, or phenomena outside human gender/sexuality norms.</p>
             <p>Reference: <a href="https://lgbtqia.fandom.com/wiki/Xenogender" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: underline; cursor: pointer;">LGBTQIA Wiki - Xenogender</a></p>`
      }
      
  ];
  
  export default genderIdentities;
  