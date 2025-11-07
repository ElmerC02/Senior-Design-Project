export default function ContactPage(){
  return (
    <section>
      <h1 className="header">Contact</h1>
      <p className="sub">Send us your questions or feedback.</p>
      <form className="card" style={{ padding: 18, maxWidth: 560 }}>
        <label>Name<br/><input className="card" style={{ width:"100%", height:40, padding:"0 10px" }}/></label><br/><br/>
        <label>Email<br/><input type="email" className="card" style={{ width:"100%", height:40, padding:"0 10px" }}/></label><br/><br/>
        <label>Message<br/><textarea className="card" rows={5} style={{ width:"100%", padding:"10px" }}/></label><br/>
        <button className="btn" type="button">Send (placeholder)</button>
      </form>
    </section>
  );
}
