function Letterhead() {
  return (
    <div className="letterhead">
      <div className="info">
        <img src="mtrh.png" className="mtrh-logo" />
        <p>
          <i>An ISO 9001:2015 Certified Hospital</i>
        </p>
        <img src="iso.png" className="iso-logo" />
        <h1 className="iso-h1">MOI TEACHING AND REFERRAL HOSPITAL</h1>
      </div>

      <div className="contact">
        <div className="left">
          <p>
            Email:director@mtrh.go.ke
            <br />
            Telephone: 053 2033471/2/3
            <br />
            Fax: 053 2061749
          </p>
        </div>
        <div className="right">
          <p>
            NANDI ROAD
            <br />
            P.O. BOX 3
            <br />
            Eldoret Kenya
          </p>
        </div>
      </div>
    </div>
  );
}
export default Letterhead;
