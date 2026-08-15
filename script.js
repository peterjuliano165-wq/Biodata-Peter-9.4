document.addEventListener('DOMContentLoaded',function(){
  // year
  const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();

  // nav toggle
  const nav=document.getElementById('mainNav');
  const btn=document.getElementById('navToggle');
  if(btn && nav){
    btn.addEventListener('click',()=>nav.classList.toggle('show'))
  }

  // copy phone number on click
  const phoneNumber = document.querySelector('.contact-phone');
  if(phoneNumber){
    const phoneValue = '+628224997785';
    const originalText = phoneNumber.textContent.trim();
    let resetTimer;

    const flashText = (message) => {
      phoneNumber.textContent = message;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        phoneNumber.textContent = originalText;
      }, 1200);
    };

    const copyPhoneNumber = async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(phoneValue);
        } else {
          const tempInput = document.createElement('textarea');
          tempInput.value = phoneValue;
          tempInput.setAttribute('readonly', '');
          tempInput.style.position = 'fixed';
          tempInput.style.top = '-9999px';
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }
        flashText('Copied!');
      } catch (err) {
        flashText('Copy failed');
      }
    };

    phoneNumber.addEventListener('click', copyPhoneNumber);
    phoneNumber.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        copyPhoneNumber();
      }
    });
  }

  // contact form submit via Formspree (fetch)
  const form=document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if(submitBtn) submitBtn.disabled = true;
      const data = new FormData(form);
      try{
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if(res.ok){
          alert('Thanks — your message was sent.');
          form.reset();
        } else {
          const json = await res.json().catch(()=>null);
          if(json && json.errors){
            alert(json.errors.map(e=>e.message).join('\n'))
          } else {
            alert('Submission failed — please try again later.');
          }
        }
      }catch(err){
        alert('Network error — please try again later.');
      }finally{
        if(submitBtn) submitBtn.disabled = false;
      }
    })
  }
});
