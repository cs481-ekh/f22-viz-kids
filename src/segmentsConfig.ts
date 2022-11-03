
export const labeledSegments: [string,string][] = [

    /* Head */
    ["LFHD","RFHD"], //forehead
    ["LBHD","RBHD"], //back of head
    ["LFHD","LBHD"], //side of head
    ["RFHD","RBHD"], //side of head

    /* Center Torso */
    ["LACR","RACR"], //collar bone
    ["MID_HJC","MID_ASIS"], //crotch front
    ["MID_HJC","MID_PSIS"], //crotch back

    /* L Torso */
    ["LILCR","LACR"], //upper side
    ["LILCR","LGTR"], //lower side
    ["LASIS","LGTR"], //outer front waist
    ["LPSIS","LGTR"], //outer back waist
    ["LASIS","MID_ASIS"], //inner front waist
    ["LPSIS","MID_PSIS"], //inner back waist

    /* R Torso */
    ["RILCR","RACR"], //upper side
    ["RILCR","RGTR"], //lower side
    ["RASIS","RGTR"], //outer front waist
    ["RPSIS","RGTR"], //outer back waist
    ["RASIS","MID_ASIS"], //inner front waist
    ["RPSIS","MID_PSIS"], //inner back waist

    /* L Arm */
    ["LSHO","LLEB"],
    ["LSHO","LMEB"],
    ["LLEB","LMWRT"],
    ["LMEB","LLWRT"],
    ["LHAND","LLWRT"],
    ["LHAND","LMWRT"],

    /* R Arm */
    ["RSHO","RLEB"],
    ["RSHO","RMEB"],
    ["RLEB","RMWRT"],
    ["RMEB","RLWRT"],
    ["RHAND","RLWRT"],
    ["RHAND","RMWRT"],

     /* L Upper Leg */
    ["LGTR","LLEP"],
    ["MID_HJC","LMEP"],
    ["LTHI","LLEP"],
    ["LTHI","LMEP"],
    ["LPSK","LLEP"],
    ["LPSK","LMEP"],

    /* L Lower Leg */
    ["LLEP","LLMAL"],
    ["LMEP","LMMAL"],
    ["LDSK","LLMAL"],
    ["LDSK","LMMAL"],

    /* L Foot */
    ["LHEEL","LTOE"],
    ["LHEEL","LMET5"],
    ["LTOE","LMET5"],

    /* R Upper Leg */
    ["RGTR","RLEP"],
    ["MID_HJC","RMEP"],
    ["RTHI","RLEP"],
    ["RTHI","RMEP"],
    ["RPSK","RLEP"],
    ["RPSK","RMEP"],

    /* R Lower Leg */
    ["RLEP","RLMAL"],
    ["RMEP","RMMAL"],
    ["RDSK","RLMAL"],
    ["RDSK","RMMAL"],

    /* R Foot */
    ["RHEEL","RTOE"],
    ["RHEEL","RMET5"],
    ["RTOE","RMET5"],

];