export interface SurvivalTopic {
  id: string;
  title: string;
  summary: string;
  steps: string[];
  tips?: string[];
  warnings?: string[];
}

export interface SurvivalCategory {
  id: string;
  title: string;
  icon: string;
  topics: SurvivalTopic[];
}

export const survivalCategories: SurvivalCategory[] = [
  {
    id: 'fire',
    title: 'Fire Starting',
    icon: 'flame-outline',
    topics: [
      {
        id: 'fire-bow-drill',
        title: 'Bow Drill Method',
        summary: 'The bow drill is one of the most reliable primitive fire-starting methods. It uses friction between a spindle and fireboard to create an ember.',
        steps: [
          'Gather materials: a straight stick for the spindle (about thumb-width), a flat piece of softwood for the fireboard, a curved stick for the bow, and cordage (shoelace, paracord, or natural fiber).',
          'Carve a small depression near the edge of your fireboard, with a V-shaped notch cut into the side to collect the ember dust.',
          'Wrap the cord around the spindle once and attach both ends to the bow.',
          'Place the spindle in the fireboard depression and hold it steady with a socket (a rock with a depression or piece of hardwood).',
          'Move the bow back and forth rapidly while applying downward pressure. Maintain a steady rhythm.',
          'Continue until you see smoke and brown/black dust collecting in the notch.',
          'Carefully transfer the ember to a tinder bundle and blow gently to create flame.',
        ],
        tips: [
          'Dry wood is essential - choose wood that snaps cleanly when bent',
          'Cedar, willow, and cottonwood work excellently for both spindle and fireboard',
          'Practice the motion before attempting to create fire',
        ],
        warnings: [
          'Never leave a fire unattended',
          'Clear the area around your fire pit of dry leaves and debris',
          'Have water or dirt nearby to extinguish if needed',
        ],
      },
      {
        id: 'fire-flint-steel',
        title: 'Flint and Steel',
        summary: 'Using flint and steel or a ferrocerium rod is one of the most reliable methods for starting fires in any weather condition.',
        steps: [
          'Prepare your tinder bundle - dry grass, birch bark, cotton balls, or char cloth work best.',
          'Hold the flint or ferro rod firmly in one hand at a 45-degree angle over the tinder.',
          'Strike the steel against the flint in a quick, scraping motion directing sparks toward the tinder.',
          'Alternatively, hold the steel still and scrape the rod across it.',
          'Once sparks catch in the tinder, gently blow to encourage flame.',
          'Add progressively larger kindling as the fire grows.',
        ],
        tips: [
          'Char cloth catches sparks extremely easily - make some in advance',
          'Keep your fire-starting kit in a waterproof container',
          'Practice striking technique before you need it in an emergency',
        ],
        warnings: [
          'Sparks can travel - clear the area of flammable materials',
          'Ferrocerium rods degrade when wet - dry thoroughly before storing',
        ],
      },
      {
        id: 'fire-hand-drill',
        title: 'Hand Drill Method',
        summary: 'The hand drill is the most primitive fire-starting method, using only a spindle and fireboard rotated by hand.',
        steps: [
          'Select a straight, dry spindle about 18-24 inches long and thumb-width.',
          'Prepare a fireboard with a depression and notch, similar to bow drill setup.',
          'Place the spindle tip in the depression and position your hands at the top.',
          'Roll the spindle between your palms while applying downward pressure.',
          'As your hands move down, quickly move them back up and continue the motion.',
          'Maintain speed and pressure until an ember forms in the notch.',
          'Transfer the ember to a tinder bundle and nurture into flame.',
        ],
        tips: [
          'This method requires significant practice and stamina',
          'Mullein, cattail, and yucca stalks make excellent spindles',
          'Adding sand to the depression can increase friction',
        ],
        warnings: [
          'This method can cause blisters - stop if skin becomes raw',
          'May not be suitable in cold weather when dexterity is reduced',
        ],
      },
      {
        id: 'fire-magnifying',
        title: 'Solar Fire Starting',
        summary: 'Using sunlight concentrated through a lens to ignite tinder. Effective on clear days.',
        steps: [
          'Obtain a magnifying glass, eyeglasses, binoculars, or even a clear water bottle.',
          'Prepare very fine, dry tinder - char cloth, punk wood, or dried fungus work best.',
          'Angle the lens to focus sunlight into the smallest possible point.',
          'Hold the focal point steady on the tinder.',
          'Keep the lens still - any movement will disperse the heat.',
          'Watch for smoke, then a glowing ember.',
          'Transfer to tinder bundle and blow into flame.',
        ],
        tips: [
          'Works best between 10am and 2pm when sun is strongest',
          'Dark-colored tinder ignites faster than light-colored',
          'A clear plastic bag filled with water can serve as an emergency lens',
        ],
        warnings: [
          'Never look through the lens at the sun',
          'This method only works in direct sunlight',
        ],
      },
    ],
  },
  {
    id: 'water',
    title: 'Finding & Purifying Water',
    icon: 'water-outline',
    topics: [
      {
        id: 'water-finding',
        title: 'Finding Water Sources',
        summary: 'Locating water is your top survival priority. Humans can only survive 3 days without water.',
        steps: [
          'Look for valleys, low points, and areas where water naturally collects.',
          'Follow animal trails - they often lead to water sources.',
          'Listen for running water - streams, rivers, waterfalls.',
          'Look for vegetation like willows, cottonwoods, and cattails that indicate water nearby.',
          'Check the base of cliffs and rock formations for seeps and springs.',
          'Dig in dry riverbeds - water often lies beneath the surface.',
          'Collect morning dew from grass and leaves using absorbent cloth.',
        ],
        tips: [
          'Birds often circle near water sources, especially in mornings and evenings',
          'Insects, particularly bees, usually stay within 400 meters of water',
          'Green vegetation in arid areas almost always indicates underground water',
        ],
        warnings: [
          'Stagnant water is more likely to contain harmful pathogens',
          'Water near mines or industrial areas may contain heavy metals',
          'Saltwater will accelerate dehydration - never drink it untreated',
        ],
      },
      {
        id: 'water-boiling',
        title: 'Boiling Water',
        summary: 'Boiling is the most reliable method to kill pathogens in water when you have fire and a container.',
        steps: [
          'Collect water and allow sediment to settle, or filter through cloth.',
          'Build a fire and bring water to a rolling boil.',
          'Maintain a rolling boil for at least 1 minute (3 minutes above 6,500 feet elevation).',
          'Allow to cool before drinking.',
          'Store purified water in clean containers.',
        ],
        tips: [
          'Hot rocks can be dropped into wooden or other non-fireproof containers to boil water',
          'A clear plastic bottle left in direct sun for 6+ hours will kill most pathogens (SODIS method)',
          'Adding a small pinch of salt improves taste and replaces minerals',
        ],
        warnings: [
          'Boiling does not remove chemical contaminants',
          'Let water cool sufficiently before drinking to avoid burns',
        ],
      },
      {
        id: 'water-filter',
        title: 'Improvised Water Filter',
        summary: 'A layered filter can remove sediment and some pathogens. Should be combined with boiling when possible.',
        steps: [
          'Cut the bottom off a plastic bottle or use a hollow log/bamboo.',
          'Add a layer of small pebbles at the bottom (drainage layer).',
          'Add a layer of sand above the pebbles.',
          'Add a layer of crushed charcoal from your fire (NOT charcoal briquettes).',
          'Add another layer of sand.',
          'Top with a layer of grass or cloth to prevent disturbing the layers.',
          'Pour water through slowly and collect the filtered water.',
          'Boil the filtered water if possible for additional safety.',
        ],
        tips: [
          'Charcoal removes many chemicals and improves taste',
          'The filter improves with use as a biofilm develops',
          'Multiple passes through the filter increases effectiveness',
        ],
        warnings: [
          'This filter alone does not guarantee safe drinking water',
          'Replace charcoal regularly as it becomes saturated',
        ],
      },
      {
        id: 'water-solar-still',
        title: 'Solar Still',
        summary: 'A solar still extracts water from soil or plants using evaporation and condensation.',
        steps: [
          'Dig a hole about 3 feet wide and 2 feet deep in a sunny location.',
          'Place a collection container in the center of the hole.',
          'Surround the container with green vegetation, cacti, or moist soil.',
          'Cover the hole with a clear plastic sheet, sealing edges with soil.',
          'Place a small rock in the center of the plastic, directly above the container.',
          'The sun heats moisture which evaporates, condenses on the plastic, and drips into your container.',
          'A tube can be added to drink without disturbing the still.',
        ],
        tips: [
          'Add urine or contaminated water to the hole - the distillation process purifies it',
          'Multiple stills increase water yield',
          'Works best in sunny conditions with moist soil',
        ],
        warnings: [
          'Solar stills produce limited water - typically 0.5-1 liter per day',
          'The energy spent building may exceed the water gained in some conditions',
        ],
      },
    ],
  },
  {
    id: 'shelter',
    title: 'Shelter Building',
    icon: 'home-outline',
    topics: [
      {
        id: 'shelter-debris-hut',
        title: 'Debris Hut',
        summary: 'A debris hut is an insulated shelter that can be built with no tools. Excellent for cold weather survival.',
        steps: [
          'Find a sturdy ridgepole about 9-12 feet long.',
          'Prop one end on a support (stump, rock, or forked stick) about 3 feet high.',
          'The other end rests on the ground.',
          'Lean sticks along both sides of the ridgepole to create a ribbed frame.',
          'Cover the frame with smaller sticks and brush.',
          'Pile debris (leaves, pine needles, grass) at least 2-3 feet thick over the entire structure.',
          'Add a final layer of branches to hold debris in place.',
          'Fill the interior with dry debris for insulation.',
          'Create a debris door to seal the entrance.',
        ],
        tips: [
          'Make it just big enough for your body - smaller = warmer',
          'The debris layer is the key to warmth - more is better',
          'Sleep on debris, not bare ground',
        ],
        warnings: [
          'Check for ant hills, poison ivy, and snake holes before gathering debris',
          'Avoid building under dead trees or branches',
        ],
      },
      {
        id: 'shelter-lean-to',
        title: 'Lean-To Shelter',
        summary: 'A simple, quick shelter that provides protection from wind and rain on one side.',
        steps: [
          'Find or create a horizontal support between two trees, about 3-4 feet high.',
          'Lean long branches against the support at a 45-60 degree angle.',
          'Space branches close together for better coverage.',
          'Cover with smaller branches and leaves, working from bottom to top like shingles.',
          'Build a fire about 6 feet in front of the opening - the lean-to will reflect heat.',
        ],
        tips: [
          'Orient the back wall toward the prevailing wind',
          'Add side walls for better protection',
          'A reflector wall behind your fire doubles the heat received',
        ],
        warnings: [
          'Open-front design provides less insulation than enclosed shelters',
          'Fire placement is critical - not too close, not too far',
        ],
      },
      {
        id: 'shelter-snow',
        title: 'Snow Shelter (Quinzee)',
        summary: 'A quinzee is a dome-shaped snow shelter that provides excellent insulation in winter conditions.',
        steps: [
          'Pile snow into a mound at least 7-8 feet wide and 5 feet high.',
          'Let the snow settle/sinter for 1-2 hours (longer in very cold temps).',
          'Insert sticks 8-10 inches into the mound as thickness guides.',
          'Dig an entrance tunnel, starting low and angling slightly upward.',
          'Hollow out the interior, stopping when you reach the guide sticks.',
          'Create a raised sleeping platform - cold air sinks.',
          'Poke a ventilation hole in the roof with a stick.',
          'Smooth the interior walls to prevent dripping.',
        ],
        tips: [
          'The entrance should be lower than the sleeping area to trap warm air',
          'Snow is an excellent insulator - interior can be 30-40°F warmer than outside',
          'Mark the shelter from outside to avoid others collapsing it',
        ],
        warnings: [
          'Always maintain ventilation to prevent CO2 buildup',
          'Never sleep directly on snow - use insulation',
          'Wet clothing quickly becomes life-threatening',
        ],
      },
    ],
  },
  {
    id: 'food',
    title: 'Finding Food',
    icon: 'nutrition-outline',
    topics: [
      {
        id: 'food-plants',
        title: 'Edible Wild Plants',
        summary: 'Many common plants are edible and nutritious. Proper identification is critical.',
        steps: [
          'Learn to identify plants BEFORE an emergency - misidentification can be fatal.',
          'Start with easily identifiable plants: dandelions, clover, cattails, pine needles.',
          'Use the Universal Edibility Test if unsure: test on skin, then lips, then tongue, then small amount.',
          'Wait 8 hours between each test phase to check for reactions.',
          'Cook plants when possible to improve digestibility and destroy some toxins.',
        ],
        tips: [
          'Dandelion greens, roots, and flowers are all edible',
          'Pine needle tea is high in vitamin C',
          'Cattails: young shoots, roots, and pollen heads are all edible',
          'Avoid plants with milky sap, umbrella-shaped flowers, or bitter/soapy taste',
        ],
        warnings: [
          'NEVER eat a plant you cannot positively identify',
          'Many edible plants have deadly look-alikes',
          'Some plants are only edible when cooked',
          'Avoid mushrooms unless you are an expert',
        ],
      },
      {
        id: 'food-insects',
        title: 'Insect Food Sources',
        summary: 'Insects are high in protein and can be found almost anywhere. A reliable survival food source.',
        steps: [
          'Look under rocks, in rotting logs, and in soil for grubs and larvae.',
          'Collect ants from hills - avoid fire ants and carpenter ants.',
          'Grasshoppers and crickets are abundant in grasslands.',
          'Remove wings, legs, and heads before eating.',
          'Cook all insects when possible to kill parasites.',
          'Roasting improves taste and makes them crispy.',
        ],
        tips: [
          'Grubs are calorie-dense and found year-round',
          'Ants taste lemony due to formic acid - cook to reduce acidity',
          'Collect insects in the early morning when they\'re sluggish',
        ],
        warnings: [
          'Avoid brightly colored insects - they are often toxic',
          'Do not eat insects found on poisonous plants',
          'Avoid stinging insects unless you remove the stinger',
          'Never eat ticks, flies, or mosquitoes - they carry disease',
        ],
      },
      {
        id: 'food-trapping',
        title: 'Basic Trapping',
        summary: 'Traps work 24/7 and conserve your energy. Set multiple traps to increase success.',
        steps: [
          'Identify animal signs: tracks, droppings, trails, and feeding areas.',
          'Set traps on trails and near water sources.',
          'Deadfall trap: A heavy rock propped up by a trigger mechanism, baited to fall on prey.',
          'Snare: A loop of wire or cordage positioned to tighten around an animal\'s neck.',
          'Check traps twice daily - more often in hot weather.',
          'Set at least 6-10 traps to ensure success.',
        ],
        tips: [
          'Camouflage your scent by rubbing traps with local vegetation',
          'Set traps in funnels created by logs, rocks, or brush',
          'Bait with strong-smelling food: berries, grubs, or fish',
        ],
        warnings: [
          'Know local laws regarding trapping',
          'Mark trap locations to find them again',
          'Trapped animals can be dangerous - approach carefully',
        ],
      },
      {
        id: 'food-fishing',
        title: 'Improvised Fishing',
        summary: 'Fish are an excellent protein source. Basic fishing is possible with minimal equipment.',
        steps: [
          'Create a hook from: wire, safety pins, thorns, bone, or carved wood.',
          'Use fishing line, paracord inner strands, or plant fibers for line.',
          'Bait with insects, worms, berries, or small pieces of fish.',
          'Fish in early morning or evening when fish are most active.',
          'Look for fish in calm pools, under overhanging banks, and near structures.',
        ],
        tips: [
          'A gorge hook (small stick sharpened at both ends) works for larger fish',
          'Fish often rest in the shade on hot days',
          'Splashing or tickling fish (trout tickling) can work in shallow streams',
        ],
        warnings: [
          'Some fish have sharp spines - handle carefully',
          'Cook fish thoroughly to kill parasites',
          'Avoid fish with red gills or slimy skin - signs of disease',
        ],
      },
    ],
  },
  {
    id: 'firstaid',
    title: 'First Aid',
    icon: 'medkit-outline',
    topics: [
      {
        id: 'firstaid-bleeding',
        title: 'Stop Severe Bleeding',
        summary: 'Severe blood loss can be fatal within minutes. Immediate action is critical.',
        steps: [
          'Apply direct pressure to the wound with a clean cloth or your hand.',
          'Maintain firm, constant pressure for at least 15 minutes.',
          'If blood soaks through, add more material without removing the first layer.',
          'Elevate the injured limb above heart level if possible.',
          'For limb wounds, apply a tourniquet 2-3 inches above the wound if direct pressure fails.',
          'Note the time the tourniquet was applied.',
          'Do not remove the tourniquet until professional help arrives.',
        ],
        tips: [
          'A belt, strip of cloth, or even a bandana can serve as an improvised tourniquet',
          'Pack deep wounds with cloth to increase pressure inside',
          'Keep the patient warm to prevent shock',
        ],
        warnings: [
          'Tourniquets can cause limb damage - use only for life-threatening bleeding',
          'Do not remove embedded objects - stabilize them in place',
          'Watch for signs of shock: pale skin, rapid pulse, confusion',
        ],
      },
      {
        id: 'firstaid-hypothermia',
        title: 'Treating Hypothermia',
        summary: 'Hypothermia occurs when core body temperature drops below 95°F (35°C). Can be fatal if untreated.',
        steps: [
          'Move the person to shelter and out of wind/wet conditions.',
          'Remove wet clothing and replace with dry layers.',
          'Cover the head - significant heat is lost through the scalp.',
          'Apply warm compresses to the neck, armpits, and groin (areas with major blood vessels).',
          'If conscious, give warm, sweet drinks - no alcohol or caffeine.',
          'Use skin-to-skin contact in a sleeping bag if other warming methods unavailable.',
          'Handle gently - rough movement can trigger cardiac arrest in severe cases.',
        ],
        tips: [
          'Prevention is easier than treatment - stay dry and sheltered',
          'The "umbles" indicate hypothermia: stumbles, mumbles, fumbles, grumbles',
          'A person may deny being cold due to mental confusion',
        ],
        warnings: [
          'Do not rub extremities - this can cause cardiac issues',
          'Alcohol increases heat loss despite feeling warm',
          'Severe hypothermia requires professional medical care',
        ],
      },
      {
        id: 'firstaid-fractures',
        title: 'Splinting Fractures',
        summary: 'Immobilizing broken bones prevents further injury and reduces pain.',
        steps: [
          'Do not attempt to straighten the bone or push it back in.',
          'Immobilize the joint above and below the fracture.',
          'Use rigid materials for splints: sticks, boards, rolled magazines, etc.',
          'Pad the splint to prevent pressure points.',
          'Secure with cloth strips, tape, or cordage - firm but not tight.',
          'Check circulation below the splint: color, temperature, and pulse.',
          'Loosen if the limb becomes pale, blue, or numb.',
        ],
        tips: [
          'An arm can be splinted against the body using a sling',
          'A fractured leg can be splinted to the other leg',
          'Keep the person warm and calm to prevent shock',
        ],
        warnings: [
          'Never apply a splint directly over a wound',
          'Open fractures (bone visible) require immediate professional care',
          'Spinal injuries require complete immobilization',
        ],
      },
      {
        id: 'firstaid-burns',
        title: 'Treating Burns',
        summary: 'Proper burn treatment prevents infection and promotes healing.',
        steps: [
          'Remove the person from the heat source.',
          'Cool the burn with cool (not cold) running water for 10-20 minutes.',
          'Remove jewelry and tight clothing before swelling occurs.',
          'Cover with a clean, non-stick bandage.',
          'Do not apply ice, butter, or other home remedies.',
          'Give over-the-counter pain relief if available.',
          'Monitor for signs of infection: increased pain, redness, swelling, pus.',
        ],
        tips: [
          'Aloe vera gel can soothe minor burns once cooled',
          'Keep burn victims warm - they lose body heat through damaged skin',
          'Clean water is essential for burn care',
        ],
        warnings: [
          'Do not break blisters - they protect against infection',
          'Burns larger than palm size or on face/joints need professional care',
          'Chemical burns require flushing with water for 20+ minutes',
        ],
      },
    ],
  },
  {
    id: 'signaling',
    title: 'Signaling & Rescue',
    icon: 'radio-outline',
    topics: [
      {
        id: 'signal-visual',
        title: 'Visual Signals',
        summary: 'Visual signals can be seen from great distances. Use contrast against your environment.',
        steps: [
          'Create ground-to-air signals at least 10 feet tall using rocks, logs, or trenches.',
          'Standard symbols: V = need assistance, X = need medical help, → = traveling this direction.',
          'Use signal fires: three fires in a triangle is an international distress signal.',
          'Add green vegetation to fire to create smoke visible during day.',
          'Use a signal mirror to flash at aircraft or distant rescuers.',
          'Brightly colored clothing or gear can be spread out as markers.',
        ],
        tips: [
          'A mirror signal can be seen 10+ miles on a clear day',
          'Movement catches the eye - wave cloth or arms when aircraft spotted',
          'Create signals in open areas visible from above',
        ],
        warnings: [
          'Do not start signal fires in dry conditions without preparation',
          'Ensure signals are clearly different from natural features',
        ],
      },
      {
        id: 'signal-audio',
        title: 'Audio Signals',
        summary: 'Sound carries well in wilderness. Three of anything is a universal distress signal.',
        steps: [
          'Three whistle blasts, shots, or shouts is the distress signal.',
          'Repeat the signal every few minutes.',
          'A whistle can be heard much farther than the human voice.',
          'If you hear a response (two signals), you\'ve been heard.',
          'Continue signaling until rescuers reach you.',
          'Stay in place once you\'ve made contact.',
        ],
        tips: [
          'Sound travels farther over water and in valleys',
          'Carry a whistle on your person at all times in the wilderness',
          'Bang rocks together if no whistle available',
        ],
        warnings: [
          'Shouting exhausts you quickly - use a whistle instead',
          'Do not move toward sounds unless certain of the source',
        ],
      },
      {
        id: 'signal-stay-found',
        title: 'Stay Found Principles',
        summary: 'Making yourself findable is as important as signaling.',
        steps: [
          'Stay in one place if possible - moving makes you harder to find.',
          'Leave clear signs of your presence and travel direction.',
          'Stay near landmarks that searchers might check: rivers, trails, clearings.',
          'Make your camp visible from air and ground.',
          'If you must move, leave notes with your direction and time of departure.',
          'Stay near your last known position if reported to others.',
        ],
        tips: [
          'File a trip plan with someone before going into the wilderness',
          'Check in at expected times - missed check-ins trigger searches',
          'A PLB (Personal Locator Beacon) can summon help anywhere in the world',
        ],
        warnings: [
          'Do not leave your signal/camp location without good reason',
          'Night travel increases risk of injury and getting more lost',
        ],
      },
    ],
  },
];
