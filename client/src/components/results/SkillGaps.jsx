function SkillGaps({ analysis }) {
const skills = analysis.missingSkills || [];

return ( <section className="result-component">

  <div className="component-header">

    <div>
      <h2>🧠 Skill Gaps</h2>

      <p>
        Skills you can learn to improve your
        chances for your target roles.
      </p>
    </div>

  </div>


  {skills.length === 0 ? (

    <div className="empty-state">
      <h3>🎉 No major skill gaps found</h3>

      <p>
        Your current skills match your recommended
        roles well.
      </p>
    </div>

  ) : (

    <div className="skill-tags">

      {skills.map((skill, index) => (
        <span key={index}>
          {skill}
        </span>
      ))}

    </div>

  )}

</section>

);
}

export default SkillGaps;
