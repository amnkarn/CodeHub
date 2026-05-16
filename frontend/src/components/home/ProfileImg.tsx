

export default function ProfileImg({img, onClick}: {img?: string, onClick?: () => void}) {

    let profileImg: string;
    if(img) {
        profileImg = img;
    } else {
        profileImg = "../../../defaultImg.png";
    }

    return (
        <div className="cursor-pointer outline-3 outline-gray-300 rounded-full hover:outline-gray-200 ml-2 " onClick={onClick}>
            <img src={profileImg} alt="#ProfileImg" className="w-8 rounded-full" />
        </div>
    )
}