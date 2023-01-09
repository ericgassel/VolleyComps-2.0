import React from 'react';
import "./AddSchool.css"

const AddModal = (props:any) => {

    const { open, close, header } = props;
  
    return (

      <div className={open ? 'openModal modal' : 'modal'}>
        {open ? (
          <section>
            <header>
              {header}
              <button className="Save" onClick={close}>
                &times;
              </button>
            </header>
            <main>{props.children}</main>
            <footer>
              <button className="Save" onClick={close}>
                close
              </button>
            </footer>
          </section>
        ) : null}
      </div>
    );
  };

  export default AddModal