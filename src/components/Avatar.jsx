import React from "react";

function Avatar(props) {
  return (
    <div>
      <img height={100} width={100} className="circle-img mt-5 mx-3" src={props.img} alt="avatar_img" />
    </div>
  );
}

export default Avatar;
